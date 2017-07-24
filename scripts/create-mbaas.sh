#! /bin/bash

# Exit on error
set -e
# Verbose output of cmds
# set -x

# Ensure we kill any background processes on exit
trap '[ -n "$(jobs -pr)" ] && kill $(jobs -p)' EXIT

# config
DOCKERCFG_FILE=${DOCKERCFG_FILE:-$HOME/.docker/.dockercfg}
MBAAS_TEMPLATE_FILE=${MBAAS_TEMPLATE_FILE:-/mnt/src/fh-openshift-templates/fh-mbaas-template-1node.json}

if [ ! -f $DOCKERCFG_FILE ]
then
  echo '$DOCKERCFG_FILE not found. This is required for automatically pulling down private images from docker hub'
  exit
fi

# MBaaS
if env | grep -q ^MBAAS_PROJECT_NAME=
then
  echo MBAAS_PROJECT_NAME env variable is already exported, resuing value of $MBAAS_PROJECT_NAME
else
  export MBAAS_PROJECT_NAME=rhmap-mbaas
  echo MBAAS_PROJECT_NAME env variable was not exported, setting to $MBAAS_PROJECT_NAME
fi
oc new-project $MBAAS_PROJECT_NAME

oc secrets new private-docker-cfg-file $DOCKERCFG_FILE
oc secrets link default private-docker-cfg-file --for=pull

oc new-app -f $MBAAS_TEMPLATE_FILE

# Debug output in backgound
oc get events -w &

# Don't exit on non zero here, as we want to keep failing until its ready
set +e

# Keep calling the status endpoint for the mbaas until it passes,
# timing out after 5 minutes
MBAAS_URL=$(oc get route mbaas --template "https://{{.spec.host}}")
MBAAS_STATUS_URL=$MBAAS_URL/sys/info/health
NEXT_WAIT_TIME=0
oc get po
echo "Waiting for MBaaS Health to return 200"
until $(curl --output /dev/null --silent --head --fail -k $MBAAS_STATUS_URL) || [ $NEXT_WAIT_TIME -eq 120 ]; do
  oc get po
  echo "Still waiting for MBaaS Health to return 200"
  ((NEXT_WAIT_TIME++))
  sleep 5 # sleep 5 seconds for a max of 120 times (600 seconds = 10 minutes)
done

# OK to exit on non zero again from here
set -e

# Run status check for full output
curl -v -k --fail $MBAAS_STATUS_URL

# Run nagios checks 2 times (for cpu to get a valid value)
NAGIOS_POD=$(oc get po -l "name=nagios" --template "{{(index .items 0).metadata.name}}")
NAGIOS_URL=$(oc get route nagios --template "https://$(oc env dc/nagios --list|grep NAGIOS_USER | awk -F'=' '{print $2}'):$(oc env dc/nagios --list|grep NAGIOS_PASSWORD | awk -F'=' '{print $2}')@{{.spec.host}}")
oc exec -ti "$NAGIOS_POD" -- /opt/rhmap/host-svc-check

# Check the status of the nagios checks
# Don't exit on non zero here, as there are known Nagios issues with the 1 node persistent template
# TODO: fix Nagios issues for 1 node persistent template
set +e
oc exec -ti "$NAGIOS_POD" -- /opt/rhmap/check-status
if [ $? == 0 ]
then
  echo "All Nagios checks passed."
else
  echo "WARNING!!!! Some Nagios checks failed. See output above for more info"
fi

echo "MBaaS URL: $MBAAS_URL"
echo "MBaaS Status URL: $MBAAS_STATUS_URL"
echo "Nagios URL: $NAGIOS_URL"
