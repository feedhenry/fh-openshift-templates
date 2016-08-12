#!/usr/bin/env bash

#set up mysql mongo memcached

oc new-app -f "${TEMPLATES_DIR}/generated/fh-core-infra.json"
