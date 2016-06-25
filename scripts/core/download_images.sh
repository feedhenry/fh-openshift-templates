#!/usr/bin/env bash

source ./common.sh


for C in "${COMPONENTS[@]}";
  do
    docker pull ${C}
  done
