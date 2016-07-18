## Nagios template

### Test

With a running RHMAP core:

```
oc new-app -f \
/mnt/src/fh-openshift-templates/nagios/nagios-template.json \
-p SMTP_SERVER=localhost,\
SMTP_USERNAME=username,\
SMTP_PASSWORD=password,\
SMTP_TLS=auto,\
SMTP_FROM_ADDRESS=admin@example.com,\
ADMIN_EMAIL=root@localhost,\
NAGIOS_USER=nagiosadmin,\
NAGIOS_PASSWORD=password,\
NAGIOS_IMAGE_NAME=docker.io/rhmap/nagios4,\
NAGIOS_IMAGE_VERSION=latest,\
RHMAP_ROUTER_DNS=$(oc get route httpd-proxy-route -o=go-template={{.spec.host}}),\
NAGIOS_HOST=$(printf "nagios-%s" "$(oc get route httpd-proxy-route -o=go-template={{.spec.host}})")
```