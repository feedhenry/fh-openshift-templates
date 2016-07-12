var _ = require('lodash');

module.exports =  {
  coreBackend: {
    'fh-core-backend': [require('../../generated/fh-core-backend.json'), {
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
        "MEMCACHED_SERVICE_HOST",
        "FH_SCM_FILE_SERVER_PATH",
        "FH_SCM_FILE_SERVER_BACKUP",
        "FH_SCM_FILE_SERVER_KEY_STORE"
      ]
    }]
  },

  coreInfra: {
    'fh-core-infra': [require('../../generated/fh-core-infra.json'), {
      ignoreEnv: [
        "REDIS_PORT",
        "MONGODB_REPLICA_NAME"
      ]
    }]
  },

  coreFrontend: {
    'fh-core-frontend': [require('../../generated/fh-core-frontend.json'), {
      ignoreEnv: [
        "FH_STATSD_SERVICE_HOST",
        "FH_STATSD_SERVICE_PORT"
      ]
    }]
  },

  generateGroups: function () {
    this.generated = _.extend({},
      this.coreBackend,
      this.coreInfra,
      this.coreFrontend
    );

    delete this.generateGroups;
    return this;
  }
}.generateGroups();
