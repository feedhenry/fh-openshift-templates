# Aggregated Logging

## Overview

This script creates all of the resources to connect to enable aggregated logging (EFK stack) for the core platform. This script is mainly based on https://docs.openshift.com/enterprise/3.2/install_config/aggregate_logging.html, but also includes the step of including common certificates and keys to allow fh-supercore to make search requests to elasticsearch.

## Setup

1. Fill in the relevant `Parameters` for the `scripts/logging/createLoggingCluster.sh`
2. Execute `scripts/logging/createLoggingCluster.sh` script.

This will perform several steps:

1. Generate ssl key and self-signed certificate to use for kibana/elasticsearch/fluentd/supercore.
2. Create a new project for logging (`LOGGING_PROJECT_NAME`)
3. Create a secret with the signed certificates and keys for the logging-deployer. This deployer sets up elasticsearch, kibana and fluentd with the certs and keys generated in step 1.
4. Create the relevant service accounts and set up permissions (Based on the guide above)
5. Create the `logging-deployer-template` app that will create the template for the EFK stack. **Note:** This step requires the script to stop until the `logging-deployer` pod has completed. This pod sets up the template for the EFK stack.
6. Generate a key and cert for fh-supercore to use for making requests to elasticsearch. It uses the same credentials as kibana.
7. Create a `CORE_ES_SECRET_NAME` secret in the `CORE_PROJECT_NAME` project to be used with fh-supercore.

*NOTE: * Sometimes the fluentd pod does not scale up automatically, so it has to be done manually.

When this process has completed, a secret in the `CORE_PROJECT_NAME` project will have been created called `CORE_ES_SECRET_NAME`. The following properties in the *fh-supercore* deploy config need to be updated:

- FH_ES_LOGGING_ENABLED: Set to `true`
- FH_ES_LOGGING_HOST - Set to https://`ES_HOSTNAME`.`OS3_MASTER_HOST` (e.g. https://eslogging.niallos32.skunkhenry.com)
- FH_ES_LOGGING_KEY_PATH - Set to `/etc/feedhenry/es-keys`
- FH_ES_LOGGING_CERT_PATH - Set to `/etc/feedhenry/es-keys`
- FH_ES_LOGGING_API_VERSION - Set to `1.5`. This is the current version of elasticsearch used by Openshift 3.2 .
- Add the `CORE_ES_SECRET_NAME` secret to the fh-supercore deploy config. Mount it at `/etc/feedhenry/es-keys`. See the gitlab-shell deploy config for an example of how a secret is mounted to a volume

E.g if `CORE_ES_SECRET_NAME` was `supercore-elasticsearch`

```
spec:
  template:
    spec:
      volumes:
        - 
          name: supercore-elasticsearch-volume
          secret:
            secretName: supercore-elasticsearch
    containers:
      -
        name: fh-supercore
        volumeMounts:
          -
            name: supercore-elasticsearch-volume
            readOnly: true
            mountPath: /etc/feedhenry/es-keys
          
```