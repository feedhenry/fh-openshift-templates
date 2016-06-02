# MySQL OpenShift template

This template is based on
[https://github.com/jboss-openshift/application-templates/blob/master/amq/amq62-persistent.json](https://github.com/jboss-openshift/application-templates/blob/master/amq/amq62-persistent.json),
with changes to accommodate the RHMAP needs.

Documentation for this template:
[https://github.com/jboss-openshift/application-templates/blob/master/docs/amq/amq62-persistent.adoc](https://github.com/jboss-openshift/application-templates/blob/master/docs/amq/amq62-persistent.adoc)

## Notable changes

- Removed multiple services - left only stomp service because we going to use this protocol
- Removed unused properties from image.
- PV strategry was changed from `ReadWriteMany` to `ReadWriteOnce`

See upstream documentation for more details.