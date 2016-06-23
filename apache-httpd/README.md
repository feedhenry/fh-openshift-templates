## Apache httpd template

## Requirements

1) Mobile SDK and App templates needs to be running

Without templates we would neeed to remove volume mounts from template.

2) Project root access

To enable root user access for apache image execute: 

	oadm policy add-scc-to-user anyuid -z default