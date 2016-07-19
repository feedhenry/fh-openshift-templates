## RHMAP Core prerequisites script
## Creates all required resources before running actual templates
## Requirements
## - oc tool configured and pointed to desired cluster
set -o errexit
set -o nounset
set -o pipefail

export SCRIPT_ROOT="$(dirname "${BASH_SOURCE}")"
export PROJECT_ROOT="$(dirname "${BASH_SOURCE}")/../.."

usage()
{
cat << EOF
usage: $0 options

RHMAP core openshift installation script.

Options:
   -h      Show this message
   -p      Openshift project name
   -i      Pull docker images from before running installation

Example:
    $0 -i -p myrhmap-project

EOF
}

## Setup required environment variables
PROJECT=
PULL_IMAGES=
while getopts “h:p:i” OPTION
do
     case $OPTION in
         h)
             usage
             exit 1
             ;;
         p)
             PROJECT=$OPTARG
             ;;
         ?)
             usage
             exit
             ;;
     esac
done

## Create project if option was specified
if [[ -n $PROJECT ]]
then
     oc new-project $PROJECT
fi

## Load common functions and environemnt variables
source $SCRIPT_ROOT/helpers.sh
source $SCRIPT_ROOT/variables.sh

echo "Creating secrets"
$SCRIPT_ROOT/secrets.sh

echo "Initial setup completed. Please run the following commands to create system layers
sudo oc create -f $PROJECT_ROOT/gitlab-shell/scc-anyuid-with-chroot.json
sudo oc adm policy add-scc-to-user anyuid-with-chroot system:serviceaccount:$(oc project -q):default

Create pods using following commands. Please verify that everything is running before executing next command from list.
$SCRIPT_ROOT/infra.sh
$SCRIPT_ROOT/backend.sh
$SCRIPT_ROOT/frontend.sh
$SCRIPT_ROOT/monitoring.sh"
