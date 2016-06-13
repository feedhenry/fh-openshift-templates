# gitlab-shell

This template requires a special Security Context Constraint (SCC) to allow
running `sshd` as root.

First, create the new SCC and add it to the default service account of the
project where the template will be instantiated:

```
oc create -f gitlab-shell/scc-anyuid-with-chroot.json
oadm policy add-scc-to-user anyuid-with-chroot system:serviceaccount:my-project:default
```

Next, instantiate the template:

```
oc new-app -f gitlab-shell/gitlab-shell-single-template.json
```
