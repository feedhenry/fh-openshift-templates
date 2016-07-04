#!/usr/bin/env bash

export TEMPLATES_DIR="$(dirname "${BASH_SOURCE}")/../.."

export MONGO_SERVICE_NAME="mongodb-service"
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
export MCORE_MYSQL_PASSWORD="coreadmin"
export MCORE_MYSQL_USER="coreadmin"
export MCORE_MYSQL_DB="shard0"

#infra
export VERSION_MONGO="centos-2.4-24"
export VERSION_MYSQL="5.5-17"
export VERSION_MEMCACHED="1.4.15-9"
export VERSION_REDIS="2.18.21"

#backend
export VERSION_GITLAB="2.0.0.pre-31"
export VERSION_MESSAGING="1.3.0-328"
export VERSION_METRICS="1.3.0-329"
export VERSION_SCM="0.17.1-243"
export VERSION_SUPERCORE="3.13.0-2399"
export VERSION_AAA="0.2.9-331"
export VERSION_UPS="latest" #should change

#front
export VERSION_MILLICORE="7.29.2"
export VERSION_HTTPD="2.4-5"
export VERSION_APPSTORE="1.0.4-77"
export VERSION_NGUI="4.9.2-2753"

export COMPONENTS=(
  docker.io/rhmap/mongodb:$VERSION_MONGO
  docker.io/rhmap/memcached:$VERSION_MEMCACHED
  docker.io/rhmap/redis:$VERSION_REDIS
  docker.io/rhmap/mysql:$VERSION_MYSQL
  docker.io/rhmap/gitlab-shell:$VERSION_GITLAB
  docker.io/rhmap/fh-messaging:$VERSION_MESSAGING
  docker.io/rhmap/fh-metrics:$VERSION_METRICS
  docker.io/rhmap/fh-scm:$VERSION_SCM
  docker.io/rhmap/fh-supercore:$VERSION_SUPERCORE
  docker.io/rhmap/fh-aaa:$VERSION_AAA
  docker.io/rhmap/unifiedpush-wildfly:$VERSION_UPS
  docker.io/rhmap/fh-appstore:$VERSION_APPSTORE
  docker.io/rhmap/millicore:$VERSION_MILLICORE
  docker.io/rhmap/httpd24:$VERSION_HTTPD
  docker.io/rhmap/fh-ngui:$VERSION_NGUI
)