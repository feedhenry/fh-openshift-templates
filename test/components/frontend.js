var _ = require('lodash');

var httpdContainerPorts = [
  {containerPort: 80}
];

module.exports = {

  millicore: {
    'fh-millicore': [require('../../fh-millicore-single-template.json'), {
      ports: [
        {containerPort: 8080},
        {containerPort: 514, protocol: 'UDP'},
        {containerPort: 8009}
      ],
      ignoreEnv: [
        "FH_STATSD_SERVICE_HOST",
        "FH_STATSD_SERVICE_PORT"
      ]
    }]
  },

  appstore: {
    'fh-appstore': [require('../../fh-appstore-single-template.json'), {
      ports: [
        {containerPort: 8080}
      ]
    }]
  },

  ngui: {
    'fh-ngui': [require('../../fh-ngui-single-template.json'), {
      ports: [
        {containerPort: 8080}
      ]
    }]
  },

  httpdp: {
    'httpd-persistent': [require('../../apache-httpd/httpd24-template.json'), {
      ports: httpdContainerPorts
    }]
  },

  generateGroups: function () {
    this.frontend = _.extend({},
      this.millicore,
      this.appstore,
      this.httpd,
      this.httpdp,
      this.ngui
    );

    delete this.generateGroups;
    return this;
  }
}.generateGroups();
