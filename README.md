# fh-openshift-templates

* Initial commit for the openshift v3 enterprise templates

  - When creating templates ensure user name, password and database name match those set in the mongo-replica template.
  - To keep things manageable I have seperated a template for each service.
  - Use the parameters section to define key values and then reference them in the rest of the template.

  Typical work flow and command usage
  -----------------------------------

  - git clone git@github.com:fheng/fh-openshift-templates.git into your working directory
  - in the openshift vm issue the following commands  (this assumes the work directory is correctly mounted)
  - n.b. the deployment sequence is important
  - "oc login" (enter credentials)
  - "oc new-project <name>" (create a new project)
  - "oc new-app -f mongo-replica.json" (deploy the mongo replication service using the template file)
  - "oc get pods" (to view the progress)
  - "oc logs <pod-id> (to view the logs - pod id can be obtained from oc get pods)
  - "oc get all" (views all the current pods,services,controllers etc)
  - "oc new-app -f redis-template.json" (deploy redis service)
  - "oc deploy redis --latest -n <project>" (start the deployoment - no startup script defined)
  - "oc get pods" (to view the progress)
  - "oc logs <pod-id> (to view the logs - pod id can be obtained from oc get pods)
  - "oc new-app -f fh-mbaas-template.json" (deploy fh-mbaas service)
  - "oc deploy fh-mbaas --latest -n <project>" (start the deployoment - no startup script defined)
  - follow the same procedure as above for pods and logs
  - "oc new-app -f fh-messaging-template.json" (deploy fh-messaging service)
  - "oc deploy fh-messaging --latest -n <project>" 
  - follow the same procedure as above for pods and logs
  - "oc new-app -f fh-metrics-template.json" (deploy fh-metrics service)
  - "oc deploy fh-metrics --latest -n <project>" 
  - follow the same procedure as above for pods and logs
  - "oc new-app -f fh-statsd-template.json" (deploy fh-statsd service)
  - "oc deploy fh-statsd --latest -n <project>"
  - follow the same procedure as above for pods and logs
  - other useful commnads
  - "docker images"
  - "docker exec -it <image name or id> "bash" (to attach into a running container)
  - "docker ps" (list all running instances)
  - "oc get svc" (list all services"
  - "oc delete dc <name>" - (delete deployment configuration)
  - "oc delete pod <pod-id>"

## Sample commands to deploy MBaaS components to openshift-master.feedhenry.io or local.feedhenry.io

```
# Login to relevant openshift cluster (you make need to confirm self-signed cert)
oc login openshift-master.feedhenry.io:8443
#oc login local.feedhenry.io:8443

# create a new project
oc new-project fh-mbaas-project

# deploy the mongo replication service using the template file
oc new-app -f mongo-replica.json

# View the progress of all pods
oc get pods -w 
# Alternatively, view the progress of a specific pod
oc logs <pod-id>

# create & deploy fh-mbaas service
oc new-app -f fh-mbaas-template.json
oc deploy fh-mbaas --latest

# create & deploy fh-messaging service
oc new-app -f fh-messaging-template.json
oc deploy fh-messaging --latest

# create & deploy fh-metrics service
oc new-app -f fh-metrics-template.json
oc deploy fh-metrics --latest

# create & deploy fh-statsd service
oc new-app -f fh-statsd-template.json
oc deploy fh-statsd --latest
```

The project can be viewed in the Web Console at:
- https://openshift-master.feedhenry.io:8443/console/project/fh-mbaas-project/overview
- Or https://local.feedhenry.io:8443/console/project/fh-mbaas-project/overview
