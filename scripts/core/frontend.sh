#!/usr/bin/env bash

# appstore, millicore, apache, ngui

oc new-app -f ../../generated/fh-core-frontend.json --param=FH_ADMIN_USER_PASSWORD="Password1",GIT_EXTERNAL_PROTOCOL="http",CLUSTER_HOST="rhmap.local.feedhenry.io"
