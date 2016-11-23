# fh-openshift-templates

## Installing an MBaaS from script

### Prerequisites

- access to the `rhmap` private images on docker.io (https://hub.docker.com/u/rhmap/dashboard/)
	- the script expects a `.dockercfg` file in `$HOME/.docker/.dockercfg}`, with the correct auth for `rhmap`. This is used to create a docker pull `secret` in the MBaaS project.
	- or you can overwrite the `DOCKERCFG_FILE` variable when calling the create script 
- an MBaaS openshift template
	- the script expects a 1 node persistent MBaaS template in `/mnt/src/fh-openshift-templates/fh-mbaas-template-1node-persistent.json`
	- or you can overwrite the `MBAAS_TEMPLATE_FILE` variable when calling the script

**NOTES:**
- the default settings in the create script are tested on an openshift vagrant development vm.
- the following variables can also be overwritten
	- `MBAAS_PROJECT_NAME` (default is `rhmap-mbaas`)

#### Sample commands using the default settings

Run these from the same host where `oc` is logged into the OpenShift cluster.

**NOTES:**
- the default settings in the create script are tested on an openshift vagrant development vm, so you will likely have to overwrite some variables unless you are running these commands directly in the vagrant development vm.

```bash
cd /mnt/src/fh-openshift-templates/scripts/
./create-mbaas.sh
```

#### Sample commands with variables being overwritten

Run these from the same host where `oc` is logged into the OpenShift cluster.

```bash
cd scripts/
DOCKERCFG_FILE=~/.dockercfg MBAAS_TEMPLATE_FILE=./fh-mbaas-template-3node.json MBAAS_PROJECT_NAME=3node-mbaas ./create-mbaas.sh
```

The output will include `events` and `pod` info, check the health endpoint of the MBaaS, and finish with a full `Nagios` check.
If there are any issues with the installation, check the output for any errors.

**NOTES:**
- Any failing Nagios checks will **not** cause the script to fail. Instead, a WARNING will be output. This may change depending on the variation of supported templates and how the Nagios checks can be dynamically defined.
- If installing the 1 node persistent MBaaS, and there are warnings or failures for `mongodb-2:Ping`, `mongodb-3:Ping` & `mongodb::replicaset` checks, these can be ignored.
- It may take a while the first time an MBaaS is installed in your cluster while the docker images are pulled. This can manifest as `ImagePullBackOff` errors for pods after a few minutes. These can be ignored unless that error occurs very early in the script execution. In that case, it would suggest invalid docker hub credentials or the docker hub account doens't have access to the image(s).

### Accessing the Nagios Dashboard

Run this command to get the Nagios Dashboard url (with username & password)

```bash
echo "https://$(oc env dc/nagios --list|grep NAGIOS_USER | awk -F'=' '{print $2}'):$(oc env dc/nagios --list|grep NAGIOS_PASSWORD | awk -F'=' '{print $2}')@$(oc get route nagios --template "{{.spec.host}}")"
```

## Building
```shell
$ npm install
```

Produce a tar with the templates:

```shell
$ grunt
```
The produced tar will be in the ```dist``` directory.

## Workflow Guidelines

* Use the parameters section to define key values and then reference them in the rest of the template.
* Keep version in template and package.json in sync.

## Productization procedure

Engineering will produce builds frequently, and update the master branch with these.
Productization will have new images less frequently, and will follow this flow:

### fh-openshift-templates

* Create and push a branch at the tip of master, named with the productization build

    * E.g. `RHMAP-4.0.0-DR9`

* Modify the template to include productized images

* Modify the version in template and package.json to a productized version

* Create a pull request in Github against the already created branch

    * This will generate a new build, and publish corresponding artifact on S3

### fhcap

* Create a corresponding branch in fhcap that a PR will be created against

    * Either from master, or from a relevant release branch

* Use [fhcap-cli](https://github.com/fheng/fhcap-cli) to do a component update for fh-openshift-templates

    * E.g. `fhcap component update fh-openshift-templates <version> <buildnumber>`

    The version and build number should correspond to the build on Jenkins.

* Create a pull request on Github against the new branch

## Setting up centralised logging (Optional)

When the core has been set up, you can create a centralised logging installation by using the `./scripts/logging` scripts. ([see README](scripts/logging/README.md))

### Troubleshooting

* During setup there may be a problem caused by slow pull of images from docker. To resolve this delete the whole project and create it again.
