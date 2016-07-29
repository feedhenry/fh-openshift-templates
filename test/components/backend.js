var _ = require('lodash');

module.exports = {

  aaa: {
    'fh-aaa': [require('../../fh-aaa-single-template.json'),{
      ports: [
        {containerPort: 8080}
      ]
    }]
  },

  scm: {
    'fh-scm': [require('../../fh-scm-single-template.json'), {
      ports: [
        {containerPort: 8080}
      ],
      ignoreEnv: [
        "FH_SCM_FILE_SERVER_PATH",
        "FH_SCM_FILE_SERVER_BACKUP",
        "FH_SCM_FILE_SERVER_KEY_STORE"
      ]
    }]
  },

  metrics: {
    'fh-metrics': [require('../../fh-metrics-single-template.json'), {
      ports: [
        {containerPort: 8080}
      ],
      ignoreEnv: [
        "MONGODB_FHREPORTING_DATABASE"
      ]
    }]
  },

  messaging: {
    'fh-messaging': [require('../../fh-messaging-single-template.json'), {
      ports: [
        {containerPort: 8080}
      ],
      ignoreEnv: [
        "FH_MESSAGING_CRON",
        "MONGODB_FHREPORTING_DATABASE"
      ]
    }]
  },

  supercore: {
    'fh-supercore': [require('../../fh-supercore-single-template.json'), {
      ports: [
        {containerPort: 8080}
      ],
      ignoreEnv: [
        "REDIS_SERVICE_PORT",
        "FH_SCM_SERVICE_PORT",
        "FH_UPS_SERVICE_PORT",
        "FH_UPS_SERVICE_HOST",
        "FH_METRICS_SERVICE_PORT",
        "FH_METRICS_SERVICE_HOST",
        "FH_MESSAGING_SERVICE_HOST",
        "FH_MESSAGING_SERVICE_PORT",
        "FH_AAA_SERVICE_HOST",
        "FH_AAA_SERVICE_PORT",
        "FH_MILLICORE_SERVICE_HOST",
        "FH_MILLICORE_SERVICE_PORT",
        "FH_SCM_SERVICE_HOST",
        "MEMCACHED_SERVICE_HOST"
      ]
    }]
  },

  gitlab: {
    'gitlab-shell': [require('../../gitlab-shell/gitlab-shell-single-template.json'), {
      ports: [
        {containerPort: 22},
        {containerPort: 8080}
      ]
    }]
  },

  generateGroups: function () {
    this.backend = _.extend({},
      this.aaa,
      this.scm,
      this.supercore,
      this.metrics,
      this.gitlab
    );

    delete this.generateGroups;
    return this;
  }
}.generateGroups();
