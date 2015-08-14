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
