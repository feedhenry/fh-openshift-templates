#!/usr/bin/env bash

# aaa, messaging, metrics, scm, supercore, gitlab-shell, ups

oc new-app -f ../../generated/fh-core-backend.json --param=GIT_EXTERNAL_HOST="git.local.feedhenry.io"
