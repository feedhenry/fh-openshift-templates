#!/usr/bin/env bash
## Secrets generator for RHMAP git integration
## 
## Run this script before running template to make sure that proper secrets are required
## 
## Requirements:
## - oc client installed and configured to talk with openshift cluster
## - bash and ssh-keygen tool available

set -o errexit
set -o nounset
set -o pipefail

TEMP_KEY_STORE=`mktemp -q -d`
TEMPLATES_STORE="$(dirname "${BASH_SOURCE}")/templates"

echo "Creating required secrets"
ssh-keygen -q -N '' -C "repoadmin_id_rsa" -f  "$TEMP_KEY_STORE/repoadmin_id_rsa"
ssh-keygen -q -N '' -C "gitlab_shell_id_rsa" -f  "$TEMP_KEY_STORE/gitlab_shell_id_rsa"

echo "Creating secrets in openshift instance"

# Create secrets
oc secrets new gitlab-ssh repoadmin-id-rsa=$TEMP_KEY_STORE/repoadmin_id_rsa \
                         repoadmin-id-rsa-pub=$TEMP_KEY_STORE/repoadmin_id_rsa.pub \
                         gitlab-shell-id-rsa=$TEMP_KEY_STORE/gitlab_shell_id_rsa \
                         gitlab-shell-id-rsa-pub=$TEMP_KEY_STORE/gitlab_shell_id_rsa.pub


cp $TEMPLATES_STORE/servicekeys.json $TEMP_KEY_STORE/servicekeys.json
sed -i "s/API_KEY_PLACEHOLDER/$MILLICORE_SERVICE_KEY/g" $TEMP_KEY_STORE/servicekeys.json
oc secrets new millicore-config servicekeys.json=$TEMP_KEY_STORE/servicekeys.json