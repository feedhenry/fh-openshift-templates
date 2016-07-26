#!/usr/bin/env bash

export SCRIPT_ROOT="$(dirname "${BASH_SOURCE}")"

source $SCRIPT_ROOT/variables.sh

#setup appstore, millicore, apache, ngui

oc new-app --param=MONGODB_ADMIN_PASSWORD="$MONGO_ADMIN_PASSWORD",MYSQL_PASSWORD="$MCORE_MYSQL_PASSWORD",CLUSTER_HOST="$CLUSTER_HOST",FH_MESSAGING_API_KEY="$MESSAGING_API_KEY",FH_SUPERCORE_API_KEY="$SUPERCORE_API_KEY" -f "${TEMPLATES_DIR}/generated/fh-core-frontend.json"
