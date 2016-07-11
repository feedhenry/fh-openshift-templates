#!/usr/bin/env bash

export TEMPLATES_DIR="$(dirname "${BASH_SOURCE}")/../.."

export MEMCACHED_SERVICE_NAME="memcached"
export MONGO_PASSWORD="sameforall"
export PROJECT="core"
export MILLICORE_API_KEY="GENERATEME"
export MILLICORE_SERVICE_KEY="GENERATEME"
export GITLAB_MILLICORE_SERVICE_KEY="GITGENERATEME"

export SUPERCORE_API_KEY="GENERATEME"
export MESSAGING_API_KEY="GENERATEME"
export METRICS_API_KEY="GENERATEME"
export REDIS_PASSWORD="GENERATEME"
export CLUSTER_NAME="rhmap"
export CLUSTER_HOST="rhmap.local.feedhenry.io"
export GIT_HTTP_HOST="git.local.feedhenry.io"
export MCORE_MYSQL_PASSWORD="coreadmin"
export MCORE_MYSQL_USER="coreadmin"
export MCORE_MYSQL_DB="shard0"
export UPS_MYSQL_PASS="unifiedpush"

export SMTP_SERVER="localhost"
export SMTP_USERNAME="username"
export SMTP_PASSWORD="password"
export SMTP_TLS="auto"
export SMTP_FROM_ADDRESS="admin@example.com"
export ADMIN_EMAIL="root@localhost"
export NAGIOS_USER="nagiosadmin"
export NAGIOS_PASSWORD="password"
export NAGIOS_HOST=$(printf "nagios-%s" "$CLUSTER_HOST")
