# MySQL OpenShift template

This template is based on
[github.com/openshift/origin/examples/db-templates/mysql-persistent-template.json](https://github.com/openshift/origin/blob/master/examples/db-templates/mysql-persistent-template.json), with changes to accommodate the RHMAP needs.

## Notable changes

- Deploy from ImageStreamTag `mysql:5.5` instead of `mysql:latest`, because we
  want to stick with a specific MySQL version, 5.5 for now.
- Set `imageChangeParams.automatic` to `false`, disabling automatic redeploys
  when the image stream is updated. This may be revisited later. No automatic
  redeploy means that the system administrator is responsible for verifying new
  image versions and manually triggering a redeploy.
- Create a PersistentVolumeClaim of 10GB (`VOLUME_CAPACITY`), instead of 1GB.
  The size is based on feedback from production usage. See
  [RHMAP-7179](https://issues.jboss.org/browse/RHMAP-7179).
- Set MySQL container memory limit (`MEMORY_LIMIT`) to 1GB, instead of 512MB.
  The size is an educated guess based on
  [millicore](https://github.com/fheng/millicore)'s usage of MySQL. See
  [RHMAP-7179](https://issues.jboss.org/browse/RHMAP-7179).
