#!/usr/bin/env bash

oc new-app -f "${TEMPLATES_DIR}/generated/fh-core-backend.json"
