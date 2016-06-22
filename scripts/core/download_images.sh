#!/usr/bin/env bash

export SCRIPT_ROOT="$(dirname "${BASH_SOURCE}")"

source $SCRIPT_ROOT/variables.sh

for C in "${COMPONENTS[@]}";
  do
    docker pull ${C}
  done
