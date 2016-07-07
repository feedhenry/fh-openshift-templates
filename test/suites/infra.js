var _ = require('lodash');

var mysqlContainerPorts = [
  {containerPort: 3306}
];

module.exports = {

  memcached: {
    'memcached': [require('../../memcached/memcached-template.json'), {
      ports: [
        {containerPort: 11211},
        {containerPort: 11211, protocol: 'UDP'}
      ]
    }]
  },

  mysqlp: {
    'mysql-persistent': [require('../../mysql/mysql-persistent-template.json'), {
      ports: mysqlContainerPorts
    }]
  },

  mysql: {
    'mysql-non-persistent': [require('../../mysql/mysql-non-persistent-template.json'), {
      ports: mysqlContainerPorts
    }]
  },

  mongo: {
    'mongodb': [require('../../mongodb/mongodb-core-single-template.json'), {
      ports: [
        {containerPort: 27017}
      ],
      ignoreEnv: [
        'MONGODB_REPLICA_NAME'
      ]
    }]
  },

  redis: {
    'redis': [require('../../redis/redis-template.json'), {
      ports: [
        {containerPort: 6379}
      ],
      ignoreEnv: [
        "REDIS_PORT"
      ]
    }]
  },

  generateGroups: function () {
    this.infra = _.extend({},
      this.mongo,
      this.redis,
      this.mysql,
      this.mysqlp,
      this.memcached
    );

    delete this.generateGroups;
    return this;
  }
}.generateGroups();
