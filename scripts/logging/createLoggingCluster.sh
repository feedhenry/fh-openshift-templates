#!/usr/bin/env bash
set -x

########################## PARAMETERS: THESE NEED TO BE POPULATED ######################
COMMON_KEY_NAMES=ca

# Temporary directory for names
OUTPUT_DIR=/tmp/keys

# The admin username for the OS3 cluster
OS3_ADMIN_USER="REPLACEME"

# The admin password for the OS3 cluster
OS3_ADMIN_PASSWORD="REPLACEME"

# The hostname for the OS3 cluster master node
OS3_MASTER_HOST="REPLACEME"

# The full url for the OS3 console - Used for the oc command line tool.
OS3_MASTER_URL=https://$OS3_MASTER_HOST:8443

# The name of the project to use for logging
LOGGING_PROJECT_NAME="REPLACEME"

# The core project name containing the fh-supercore deployment
CORE_PROJECT_NAME="REPLACEME"

# The name of the secret to use for supercore that contains the key and certs to use to connect to elasticsearch
CORE_ES_SECRET_NAME=supercore-elasticsearch

# The username to use for supercore to contact elasticsearch (DO NOT CHANGE)
KIBANA_ES_USER=system.logging.kibana

# The name of the route to expose on the elasticsearch service. This is used by fh-supercore to contact elasticsearch
ES_ROUTE_NAME=logging-es


# The host name for the elasticsearch route.
ES_HOSTNAME=onpremlogging


########################## END PARAMETERS ######################

mktemp -q -d $OUTPUT_DIR

oc login $OS3_MASTER_URL -u $OS3_ADMIN_USER -p $OS3_ADMIN_PASSWORD


##### GENERATING SELF SIGNED CERTS FOR LOGGING ########


# If you want to use your own key/certs then you could just copy them into $OUTPUT_DIR/$COMMON_KEY_NAMES.key and $OUTPUT_DIR/$COMMON_KEY_NAMES.crt and then comment out the 3 lines below.


# Generating a key
openssl genrsa -out $OUTPUT_DIR/$COMMON_KEY_NAMES.key 1024

# Generating a certificate signing request
openssl req -new -key $OUTPUT_DIR/$COMMON_KEY_NAMES.key -out $OUTPUT_DIR/$COMMON_KEY_NAMES.csr -subj "/CN=system.logging/OU=OpenShift/O=Logging/L=Test/C=DE" -days 712 -nodes

# Self-signing the certificate for testing
openssl x509 -req -days 365 -in $OUTPUT_DIR/$COMMON_KEY_NAMES.csr -signkey $OUTPUT_DIR/$COMMON_KEY_NAMES.key -out $OUTPUT_DIR/$COMMON_KEY_NAMES.crt


##### END GENERATING SELF SIGNED CERTS  FOR LOGGING ########



oc adm new-project ${LOGGING_PROJECT_NAME} --node-selector=""

# logging project should be already created
oc project logging

####### Creating a new secret for the logging-deployer
oc secrets new logging-deployer ca.key=$OUTPUT_DIR/$COMMON_KEY_NAMES.key ca.crt=$OUTPUT_DIR/$COMMON_KEY_NAMES.crt kibana.key=$OUTPUT_DIR/$COMMON_KEY_NAMES.key kibana.crt=$OUTPUT_DIR/$COMMON_KEY_NAMES.crt

####  Creating a logging-deployer service account
oc create -f - <<API
apiVersion: v1
kind: ServiceAccount
metadata:
  name: logging-deployer
secrets:
- name: logging-deployer
API

oc policy add-role-to-user edit --serviceaccount logging-deployer

## Adding a privileged access for the fluentd service account for fluentd. This is because it is reading the output of all containers in all projects.
oc adm policy add-scc-to-user privileged system:serviceaccount:${LOGGING_PROJECT_NAME}:aggregated-logging-fluentd

# Give the Fluentd service account permission to read labels from all pods:
oc adm policy add-cluster-role-to-user cluster-reader system:serviceaccount:${LOGGING_PROJECT_NAME}:aggregated-logging-fluentd


oc new-app logging-deployer-template \
             --param KIBANA_HOSTNAME=kibana.$OS3_MASTER_HOST \
             --param ES_CLUSTER_SIZE=1 \
             --param PUBLIC_MASTER_URL=$OS3_MASTER_URL \
             --param ENABLE_OPS_CLUSTER=false \
             --param IMAGE_PREFIX=registry.access.redhat.com/openshift3/

echo "Check that the logging-deployer pod has completed (oc get pods) has completed and then hit ENTER"
read meh

# See https://docs.openshift.com/enterprise/3.2/install_config/aggregate_logging.html#troubleshooting-kibana
oc delete oauthclient/kibana-proxy

# Finally, deploy the `logging-support-template`
oc new-app logging-support-template

# Creating a route to allow external access to the elasticsearch service.
oc create route passthrough --service=logging-es --hostname=$ES_HOSTNAME.$OS3_MASTER_HOST

#### Create a kibana ssl cert to be used with fh-supercore

./genSupercoreCerts.sh $KIBANA_ES_USER $OUTPUT_DIR

#### Switch to the RHMAP core project

oc project $CORE_PROJECT_NAME

#### Creating a secret for fh-supercore that will use the kibana credentials to perform searches.

oc secrets new $CORE_ES_SECRET_NAME key=$OUTPUT_DIR/$KIBANA_ES_USER.key crt=$OUTPUT_DIR/$KIBANA_ES_USER.crt





