# fh-openshift-templates

## Building
```shell
$ npm install
```

Produce a tar with the templates:

```shell
$ grunt
```
The produced tar will be in the ```dist``` directory.

## Testing

### Testing all templates

To run tests on all templates, run
```shell
$ npm run test
```

### Testing individual templates

At some points it may be desirable to run tests on only one template at a time and work on only those errors.

To do this you should specify the component template you wish to run tests on in
the `--components` argument. For example, to run tests on only the `fh-aaa` template
you should run:
```shell
$ npm run test --suite=aaa # Runs tests on all fh-aaa template
```

The list of available template components which can be used can
be found in files within the `test/components/` directory.

For example, the `test/components/backend.js` file contains the key `scm`,
this relates to the `fh-scm-single-template.json` template.

The object also specifies some configuration options about how to run the tests.

To run the tests on the `fh-scm` template we would then run the following:
```shell
npm run test --suite=scm
```
This can be done with any key in any module in the `test/components/` directory, including
those which specify groups of templates.

### Testing groups templates

If you wish to run tests on two or more component templates that are not specified
as a group in the `test/components/` directory then you can specify a list of keys
in `--components`. For example to run tests on the `fh-scm-single-template.json` and
`generated/fh-core-backend.json` templates together you would run:
```shell
npm run test --suite="scm coreBackend"
```

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

* If part of a release, notify @jasonmadigan (engineering release manager)


## setup a local core

Start by creating openshift VM following this guide (setup section only): https://github.com/fheng/help/blob/master/developer_guides/rhmap_openshift/rhmap_on_openshift.md#setup.

Clone this repository to folder specified in `<fhcap>/roles/dev.json` under `default_attributes/host_src_dir`.

Run `vagrant ssh` from `<fhcap>/flavours/rhel_openshift3/`. Run `oc login` and login as `test` user with password `test`.

Note: When using scripts on mac ssed tool should be installed. By default sed command is used for different purpose:

    brew install ssed
    alias sed='ssed'

Note: If you want to deploy the core cluster to a remote openshift instance, the `local.feedhenry.io` addresses in `scripts/core/variables.sh` need to change to reflect the DNS address of your cluster (e.g. osm.skunkhenry.com)

Note: You will need a number of `Available` Persistent Volumes. The size of these may vary depending on the Pod requirement, but having enough of the minimum requirement should be sufficient (having a PV that is larger than the required amount is OK). If no PV's are available in the dev vm, the sample pvs.yaml file can be used to create a range of PV's (e.g. 10x1Gi, 10x2Gi, 10x5Gi, 10x25Gi, 10x50Gi)

```
for i in {1..50}; do mkdir /home/vagrant/devpv${i} && chmod 777 /home/vagrant/devpv${i} && chcon -R -t svirt_sandbox_file_t /home/vagrant/devpv${i}; done
sudo oc create -f /mnt/src/fh-openshift-templates/pvs.yaml
```

Due to the nature of development tearing up and down projects regularly, it is recommended to have many PV's on standby to avoid having their absence block a Core setup. The PV's created from the sample `pvs.yaml` file have a `persistentVolumeReclaimPolicy` of `Recycle` which should allow re-use of any unbound PVs.

If a Pod is failing to start due to no PV's being available, you can create the necesssary PV(s) then delete the pod using `oc delete <broken-pod>`, which will cause a new pod to come up and use the new PV. Alternatively, if the pod timed out starting, you mean need to redeploy it using `oc deploy --latest <deploy-config>`.

* Ensure you're logged in to OpenShift with `oc` inside the `rhel_openshift3` VM as the `test` user, then paste the following (change the value of the project name in the first line if necessary):

``` shell
export CORE_PROJECT_NAME=core
oc new-project $CORE_PROJECT_NAME
cd /mnt/src/fh-openshift-templates/scripts/core

# Set up Secrets
# Note: On the Mac, you will need to replace the `sed` command in scripts/core/secrets.sh with `ssed`
# Note: On the Mac, you will need to add a folder path to the `mktemp` command in scripts/core/secrets.sh
./prerequisites.sh

# Create new SecurityContextConstraint that allows `chroot` capability
sudo oc create -f ../../gitlab-shell/scc-anyuid-with-chroot.json

# Add the default ServiceAccount for the project to that SCC for gitlab-shell (sshd)
sudo oc adm policy add-scc-to-user anyuid-with-chroot \
    system:serviceaccount:${CORE_PROJECT_NAME}:default

./infra.sh
```

* Wait until all the Pods are running, and the MongoDB initiator Pod has exited successfully, then continue with:

``` shell
./backend.sh
```

* Wait until all of the new Pods are running successfully, then continue with:

``` shell
./frontend.sh
```

* Wait until all of the new Pods are running successfully, then setup the monitoring containers:

``` shell
./monitoring.sh
```

Note: the login credentials for the Nagios dashboard in a development environment are set in `./variables.sh` to nagiosadmin/password. You can access the Nagios dashboard from the exposed Nagios route i.e. https://nagios-rhmap.local.feedhenry.io/ in a local development VM.

* When all Pods are successfully running, and all Nagios checks are passing (may take a few minutes for all checks to run at least once) you should be able to login to http://rhmap.local.feedhenry.io as rhmap-admin@example.com/Password1

### troubleshooting

* After `./infra.sh` you may run into a problem when mongodb-initiator ends with an error. To resolve this run `oc delete dc mongodb-1`, `oc delete pod mongodb-initiator --grace-period=0` and then run `./infra.sh` again.

* During setup there may be a problem caused by slow pull of images from docker. To resolve this delete the whole project and create it again.
