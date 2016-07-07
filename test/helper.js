var _ = require('lodash');

function getObjectsByKind(template, kind) {
  return _(template.objects)
  .filter(function (obj) {
    return obj.kind === kind;
  });
};

function getContainers (template) {
  return getObjectsByKind(template, 'DeploymentConfig')
  .map('spec.template.spec.containers')
  .flatten();
};

function getVolumes (template) {
  return getObjectsByKind(template, 'DeploymentConfig')
  .map('spec.template.spec.volumes')
  .flatten();
};

module.exports = {
  findLabelNames: function (template) {
    return getObjectsByKind(template, 'DeploymentConfig')
    .map('metadata.labels.name')
    .compact()
    .value();
  },

  findServiceNames: function (template) {
    return getObjectsByKind(template, 'Service')
    .map('spec.selector.name')
    .uniq()
    .compact()
    .value();
  },

  findContainerPorts: function (template) {
    return getContainers(template)
    .map('ports')
    .flatten()
    .map(function (port) {
      return _.extend({protocol: 'TCP'}, port);
    })
    .value();
  },

  findServicePorts: function (template) {
    return getObjectsByKind(template, 'Service')
    .map('spec.ports')
    .flatten()
    .map(function (port) {
      // To match container object structure so that a clean looking deep assert
      // can be performed by the tests
      return _.extend(
        {protocol: 'TCP', containerPort: port.port},
        _.pick(port, ['protocol'])
      );
    })
    .value();
  },

  findEnvVars: function (template, options) {
    return getContainers(template)
    .map('env')
    .flatten()
    .compact()
    .filter(function (env) {
      if (options && options.ignoreEnv) {
        return !_.includes(options.ignoreEnv, env.name);
      } else {
        return true;
      }
    })
    .value();
  },

  // Get values of all env vars, if they're params, strip the replacement syntax
  // characters '${}' and return just the parameter name
  parseEnvValues: function (envs) {
    return _(envs)
    .map('value')
    .compact()
    .map(function (env) {
      return env.replace('${', '').replace('}', '');
    })
    .value();
  },

  findVolumeMounts: function (template) {
    return getContainers(template)
    .map('volumeMounts')
    .flatten()
    .map('name')
    .compact()
    .value();
  },

  findVolumeDefinitions: function (template) {
    return getVolumes(template)
    .map('name')
    .compact()
    .value();
  },

  has: function (obj, keys) {
    return _.every(keys, _.partial(_.has, obj));
  }
};
