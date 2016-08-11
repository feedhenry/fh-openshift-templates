#!/usr/bin/env bash

export SCRIPT_ROOT="$(dirname "${BASH_SOURCE}")"

source $SCRIPT_ROOT/variables.sh

#set up mysql mongo memcached

oc new-app -f "${TEMPLATES_DIR}/generated/fh-core-infra.json"
