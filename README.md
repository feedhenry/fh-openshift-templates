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
