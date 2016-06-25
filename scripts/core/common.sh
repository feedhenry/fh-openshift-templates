#!/usr/bin/env bash

TEMPLATES_DIR="$GOPATH/src/github.com/fheng/fh-openshift-templates"

MONGO_SERVICE_NAME="mongodb-service"
MEMCACHED_SERVICE_NAME="memcached"
MONGO_PASSWORD="sameforall"
PROJECT="core"
MILLICORE_API_KEY="CHANGEME"
MILLICORE_SERVICE_KEY="CHANGEME"
#MILLICORE_SERVICE_KEY="ZYXWVUTSRQPONM0987654321"
SUPERCORE_API_KEY="CHANGEME"
MESSAGING_API_KEY="CHANGEME"
METRICS_API_KEY="CHANGEME"
METRICS_API_KEY="CHANGEME"
REDIS_PASSWORD="changeme"
CLUSTER_NAME="rhmap"
CLUSTER_HOST="rhmap.local.feedhenry.io"
MCORE_MYSQL_PASSWORD="coreadmin"
MCORE_MYSQL_USER="coreadmin"
MCORE_MYSQL_DB="shard0"

#infra
VERSION_MONGO="centos-2.4-24"
VERSION_MYSQL="5.5"
VERSION_MEMCACHED="1.4.15-9"
VERSION_REDIS="2.18.21"
#backend
VERSION_GITLAB="2.0.0.pre-14"
VERSION_MESSAGING="1.3.0-328"
VERSION_METRICS="1.3.0-329"
VERSION_SCM="0.17.1-243"
VERSION_SUPERCORE="3.13.0-2399"
VERSION_AAA="0.2.10-332"
VERSION_UPS="latest" #should change
#front
VERSION_MILLICORE="7.29.0-2143"
VERSION_HTTPD="2.4-5"
VERSION_APPSTORE="1.0.4-77"
VERSION_NGUI="4.9.2-2753"

COMPONENTS=(
  docker.io/rhmap/mongodb:$VERSION_MONGO
  docker.io/rhmap/memcached:$VERSION_MEMCACHED
  docker.io/rhmap/redis:$VERSION_REDIS
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

