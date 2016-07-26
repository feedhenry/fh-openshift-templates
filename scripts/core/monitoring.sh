#!/usr/bin/env bash

export SCRIPT_ROOT="$(dirname "${BASH_SOURCE}")"
source $SCRIPT_ROOT/variables.sh

oc create serviceaccount nagios

oc policy add-role-to-user admin -z nagios

oc new-app -f "${TEMPLATES_DIR}/generated/fh-core-monitoring.json" \
  -p SMTP_SERVER="${SMTP_SERVER}" \
  -p SMTP_USERNAME="${SMTP_USERNAME}" \
  -p SMTP_PASSWORD="${SMTP_PASSWORD}" \
  -p SMTP_TLS="${SMTP_TLS}" \
  -p SMTP_FROM_ADDRESS="${SMTP_FROM_ADDRESS}" \
  -p ADMIN_EMAIL="${ADMIN_EMAIL}" \
  -p NAGIOS_USER="${NAGIOS_USER}" \
  -p NAGIOS_PASSWORD="${NAGIOS_PASSWORD}" \
  -p RHMAP_ROUTER_DNS="${CLUSTER_HOST}" \
  -p NAGIOS_HOST="${NAGIOS_HOST}" \
  -p RHMAP_HOSTGROUPS="${RHMAP_HOSTGROUPS}"