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
To run tests on all templates, run
```shell
$ npm run test
```

To run tests on a specific group of templates or an individual template pass in a `--suite` value
to the tests.
```shell
$ npm run test --suite=generated # Runs tests on all templates

$ npm run test --suite=aaa # Runs tests on all fh-aaa template
```
### Template suites
The list of available template suites which can be passed into `npm run test` are:
* `component` - Runs all templates, but no groups, identical to `npm run test`
* `backend` - All `fh-core-backend` templates
 - `aaa` - fh-aaa
 - `scm` - fh-scm
 - `supercore` - fh-supercore
 - `gitlab` - gitlab-shell
* `frontend` - All `fh-core-frontend` templates
 - `millicore` - millicore
 - `appstore` - fh-appstore
 - `ngui` - fh-ngui
 - `httpd` - apache-httpd
 - `httpdp` - apache-httpd persistent
* `infra` - All `fh-core-infra` templates
 - `memcached` - memcached
 - `mysql` - mysql
 - `mysqlp` - mysql persistent
 - `mongo` - mongodb
 - `redis` - redis
* `generated` - All generated templates
 - `coreInfra` - `fh-core-infra`
 - `coreBackend` - `fh-core-backend`
 - `coreFrontend` - `fh-core-frontend`

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

* create a new project oc new-project core
* cd scripts/core
* make sure docker login is configured as in [fhcap-documentation](https://github.com/fheng/fhcap/tree/master/flavours/rhel_openshift3#mounting-docker-credentials-into-the-vm-to-allow-pulling-of-private-images)
* run ./prerequisites.sh
* Manually execute commands printed as results of prerequisites:
* run ./infra.sh  (in the ui wait till the mongo intiator is no longer visible)
* run ./backend.sh (wait till all images are running and blue)
* run ./front.sh
* visit http://rhmap.local.feedhenry.io
* login with rhmap-admin@example.com

## OMG I have no permissions

Just as with fhcap occasionally you can end up with no permissions at the first login

````
oc get pods

oc rsh <mysql-pod>

mysql -u root

use shard0

update sys_Sub set aaaActive=0 where guid !=""

```

In the OSE vm

```
sudo yum install telnet

```
get the ip of the memcached container

```
oc describe svc memcached

telnet <10.x.x.x> 11211

flush_all

ctrl + ]

exit

Note some times it can help to restart millicore

oc scale dc/millicore --replicas=0
wait for it to stop
oc scale dc/millicore --replicas=1
wait for it to fully start  
```

logout hard refresh and log back in
