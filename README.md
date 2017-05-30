# fh-openshift-templates

## MBaaS Overview 

The MBaaS (Mobile Backend As A Service) for the RHMAP self managed deployment on OpenShift is made up of 2 different templates

- 1 Node persistent template - used for POC and non production type environments
- 3 Node persistent template - used for production type environments

The 1 node template creates a single mongodb persistent pod and one replica of each of the components that make up the mbaas, i.e fh-mbaas, fh-messaging, fh-metrics, fh-statsd. The nagios pod is used to monitor the resource usage.

As mentioned the 3 node mbaas is strongly recommended for production type environments, it makes use of 3 mongodb pods that get deployed on labeled nodes (this is to ensure that the mongodb pods are not deployed on the same nodes), and 3 replicas of fh-mbaas, fh-messaging and fh-metrics with fh-statsd and nagios set for only one replica.

A simple example on labeling the nodes

```bash

oc label node mbaas-1 type=mbaas
oc label node mbaas-2 type=mbaas
oc label node mbaas-3 type=mbaas

oc label node mbaas-1 mbaas_id=mbaas1
oc label node mbaas-2 mbaas_id=mbaas2
oc label node mbaas-3 mbaas_id=mbaas3

```

### 1 Node persistent MBaaS

RHMAP 1-Node MBaaS for OpenShift will require the following resources outlined in the table below at a minimum:

- **Prerequisites**
    - OpenShift project created 
    - A 25G PV (persistent volume) needs to be available
    - Acces to this repo (i.e clone the repository)



	|  Description                               | Parameter name               | Default value           | Fail/warning/recommended             |
	|--------------------------------------------|------------------------------|-------------------------|--------------------------------------|
	| Min number of CPUs                         | `min_required_vCPUS`         | 2                       | fail only in strict_mode             |
	| Min system memory per node (in MB)         | `required_mem_mb_threshold`  | 7000                    | fail only in strict_mode             |
	| Min total free memory of all nodes (in KB) | `warning_kb_value`           | 4000000                 | warning                              |
	| Number of PVs with 50 GB storage           | `required_50_pv`             | 0                       | warning                              |
	| Number of PVs with 25 GB storage           | `required_25_pv`             | 1                       | warning                              |
	| Number of PVs with  5 GB storage           | `required_5_pv`              | 0                       | warning                              |
	| Number of PVs with  1 GB storage           | `required_1_pv`              | 1                       | warning                              |



- **To deploy the MBaaS on OpenShift execute the following command**

  ```bash
  
  cd /directory-to-fh-openshift-templates
  # first execute the config map creation
  oc new-app -f rhmap-mbaas-config.json
  # create the 1 node mbaas
  oc new-app -f fh-mbaas-template-1node.json 

  --> Deploying template "1node-mbaas/fh-mbaas" for "fh-mbaas-template-1node.json" to project 1node-mbaas

     fh-mbaas
     ---------
     Red Hat Mobile Backend as a Service template
  

  ``` 
- **Monitor the deploy on OpenShift**

  ```bash
  
  oc get pods
  NAME                   READY     STATUS    RESTARTS   AGE
  fh-mbaas-1-vrzfm       1/1       Running   4          7m
  fh-messaging-1-brldn   1/1       Running   3          6m
  fh-metrics-1-bxnwk     1/1       Running   4          7m
  fh-statsd-1-wx4ck      1/1       Running   0          6m
  mongodb-1-1-ff6vp      1/1       Running   0          5m
  nagios-1-704pp         1/1       Running   0          6m
  

  ```

- **Check Nagios for all health endpoints**

    - In the OpenShift web console navigate to Applications -> Pods
    - Click on the nagios-x-xxx link
    - Navigate to the Environments tab
    - Copy the nagios password
    - Navigate to Applications route
    - Click on the nagios route
    - Enter the credentials (user is nagiosadmin) and use the copied password

    or execute the follwoing command

    ```bash

    echo "https://$(oc env dc/nagios --list|grep NAGIOS_USER | awk -F'=' '{print $2}'):$(oc env dc/nagios --list|grep NAGIOS_PASSWORD | awk -F'=' '{print $2}')@$(oc get route nagios --template "{{.spec.host}}")"

    ```



### 3 Node persistent MBaaS

RHMAP 3-Node MBaaS for OpenShift will require the following resources outlined in the table below at a minimum:

- **Prerequisites**
    - You must have at least 3 hosts in the inventory under `mbaas` group.
    - The 3 nodes need to be labeled `mbaas_id=mbaas-1,mbaas_id=mbaas-2 and mbaas-id=mbaas-3` respectively - refer to the OpenShift documentation for labeling nodes
    - 3 25G PV (persistent volumes) created and available
    - Installation of RHMAP 3-Node MBaaS in production will require the following resources outlined in the table below at a minimum:
    - Acces to this repo (i.e clone the repository)



	|  Description                               | Parameter name               | Default value           | Fail/warning/recommended             |
	|--------------------------------------------|------------------------------|-------------------------|--------------------------------------|
	| Min number of CPUs                         | `min_required_vCPUS`         | 2                       | fail only in strict_mode             |
	| Min system memory per node (in MB)         | `required_mem_mb_threshold`  | 7000                    | fail only in strict_mode             |
	| Min total free memory of all nodes (in KB) | `warning_kb_value`           | 4000000                 | warning                              |
	| Number of PVs with 50 GB storage           | `required_50_pv`             | 3                       | warning                              |
	| Number of PVs with 25 GB storage           | `required_25_pv`             | 0                       | warning                              |
	| Number of PVs with  5 GB storage           | `required_5_pv`              | 0                       | warning                              |
	| Number of PVs with  1 GB storage           | `required_1_pv`              | 1                       | warning                              |



- **To deploy the 3 node MBaaS on OpenShift execute the following command**

  ```bash
  
  cd /directory-to-fh-openshift-templates
  # first execute the config map creation
  oc new-app -f rhmap-mbaas-config.json -p MONGODB_REPLICA_NAME=rs0
  # create the 3 node mbaas
  oc new-app -f fh-mbaas-template-3node.json 

  --> Deploying template "3node-mbaas/fh-mbaas" for "fh-mbaas-template-3node.json" to project 3node-mbaas

     fh-mbaas
     ---------
     Red Hat Mobile Backend as a Service template

        
    ```

- **Monitor the deploy on OpenShift**

  ```bash
  
  oc get pods
  NAME                   READY     STATUS    RESTARTS   AGE
  fh-mbaas-3-7pc82       1/1       Running   1          12m
  fh-mbaas-3-7wfrb       1/1       Running   1          12m
  fh-mbaas-3-qzqf2       1/1       Running   1          12m
  fh-messaging-1-2f7v3   1/1       Running   3          31m
  fh-messaging-1-t1wc7   1/1       Running   0          21m
  fh-messaging-1-vx319   1/1       Running   0          21m
  fh-metrics-1-2l9vw     1/1       Running   3          31m
  fh-metrics-1-9xgb7     1/1       Running   0          21m
  fh-metrics-1-rjtk0     1/1       Running   0          21m
  fh-statsd-1-dtmsn      1/1       Running   0          31m
  mongodb-1-1-jtz12      1/1       Running   0          33m
  mongodb-2-1-hzkjr      1/1       Running   0          31m
  mongodb-3-1-mpm43      1/1       Running   0          21m
  nagios-1-pk9sm         1/1       Running   0          21m 

  ```

- **Check Nagios for all health endpoints**

    - In the OpenShift web console navigate to Applications -> Pods
    - Click on the nagios-x-xxx link
    - Navigate to the Environments tab
    - Copy the nagios password
    - Navigate to Applications route
    - Click on the nagios route
    - Enter the credentials (user is nagiosadmin) and use the copied password

    or execute the following command

    ```bash

    echo "https://$(oc env dc/nagios --list|grep NAGIOS_USER | awk -F'=' '{print $2}'):$(oc env dc/nagios --list|grep NAGIOS_PASSWORD | awk -F'=' '{print $2}')@$(oc get route nagios --template "{{.spec.host}}")"

    ```


### Troubleshooting
- Problems usually encountered are to do with docker images (check access and credentials) and PV (persistent volumes)
