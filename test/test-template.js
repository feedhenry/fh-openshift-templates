var expect = require('chai').expect;
var withData = require('leche').withData;
var helper = require('./helper');
var components = require('./components');
var _ = require('lodash');

// Default tests to the all component suite
var componentGroup = components.all;
var params = ['component'];

if (process.env.npm_config_components) {
  params = process.env.npm_config_components.split(' ');

  if(helper.has(components, params)) {
    // Retrieve leche component suite from components.js
    componentGroup = {};
    _.forEach(params, function (param) {
      _.extend(componentGroup, components[param]);
    });
  } else {
    process.exit(1);
  }
}

describe('Openshift Template on component group(s) "' + params.join(', ') + '"', function() {
  // Run each test with the selected suite of components
  withData(componentGroup, function (template, options) {

    it('should have a parameter for each env var', function () {
      var paramNames = _.map(template.parameters, 'name');

      var envValues = helper.parseEnvValues(helper.findEnvVars(template, options));

      var diff = _.difference(envValues, paramNames);

      // Env var values should be a subset of parameter names, not equal
      expect(
        diff.length,
        "Environment variable mismatch. \n\n " +
        "The environment variables defined in template to not have corresponding parameters \n\n " +
        "If this is expected then an exception should be added to the test configuration in components/ \n\n " +
        "The environment variables defined in the template are as follows: " + _(envValues).join(', ') + "\n\n " +
        "The parameters defined in the template are as follows: " + _(paramNames).join(', ') + "\n\n " +
        "The environment variable names to ignore (from test configuration) are as follows: " + _(options.ignoreEnv).join(', ') + " \n\n " +
        "The difference between the environment variables and the parameters in the template are as follows: " + _(diff).join(', ') + "\n\n " +
        "These environment variable values should either be placed into the ignoreEnv array in the test configuration " +
        "or a parameter should be added for it \n\n"
      ).to.equal(0);
    });

    it('should have the correct corresponding label in the DeploymentConfig', function () {
      var deploymentConfigLabels = helper.findLabelNames(template);

      var serviceNames = helper.findServiceNames(template);

      // Labels should match completely
      expect(
        deploymentConfigLabels,
        "Label mismatch. \n\n " +
        "The 'name' label defined in DeploymentConfig(s) spec.template.metadata.labels.name does not match the 'name' label defined in Service(s) spec.selector.name \n\n " +
        "The label defined in DeploymentConfig(s) spec.template.metadata.labels.name is " + _(deploymentConfigLabels).join(', ') + " \n\n " +
        "The label defined in Service(s) spec.selector.name is " + _(serviceNames).join(', ') + "\n\n " +
        "Update these values to ensure they match \n\n"
      ).to.deep.equal(serviceNames);
    });

    it('should have a corresponding volume mount for each volume definition', function () {
      var volumeMounts = helper.findVolumeMounts(template);

      var volumeDefinitions = helper.findVolumeDefinitions(template);

      var diff = _.difference(volumeMounts, volumeDefinitions);

      expect(
        diff.length,
        "Volume definition mismatch. \n\n " +
        "The volume mounts defined in the template do not all have corresponding volume definitions \n\n " +
        "The volume mounts defined in the template are as follows: " + _(volumeMounts).join(', ') + " \n\n " +
        "The volume definitions in the template are as follows: " + _(volumeDefinitions).join(', ') + " \n\n " +
        "The mismatch between the volume mounts and volume defintions are as follows: " + _(diff).join(', ') + " \n\n " +
        "Ensure that all volume mounts have a corresponding volume definition \n\n"
      ).to.equal(0);
    });

    it('should have a container port for each service port', function () {
      var containerPorts = helper.findContainerPorts(template);

      var servicePorts = helper.findServicePorts(template);

      var diff = _.differenceWith(servicePorts, containerPorts, _.isEqual);

      // Container ports and service ports should match completely
      expect(
        diff.length,
        "Template port mismatch. \n\n " +
        "The ports defined in spec.ports in Service(s) do not match the ports defined in spec.template.spec.containers in DeploymentConfig(s) \n\n " +
        "The ports defined in Service(s) spec.ports are as follows: " + helper.prettyPrintPorts(servicePorts) + "\n\n " +
        "The ports defined in DeploymentConfig(s) spec.template.spec.containers are as follows: " + helper.prettyPrintPorts(containerPorts) + "\n\n " +
        "The ports which need to be added to DeploymentConfig(s) spec.template.spec.containers are as follows: " +
        helper.prettyPrintPorts(_(servicePorts).difference(containerPorts).value()) + " \n\n"
      ).to.equal(0);
    });

    if (options && options.ports) {
      it('should have the correct ports opened', function () {
        var containerPorts = helper.findContainerPorts(template);

        var ports = _.map(options.ports, function (port) {
          return _.extend({protocol: 'TCP'}, port);
        });
        // Container ports should match defined ports completely
        // because of the Service and container ports should match test
        // this means that the service ports are covered in this test too
        expect(
          containerPorts,
          "Template port mismatch. \n\n " +
          "The ports defined in the templates are not equal to those defined in the test configuration \n\n " +
          "The ports in the template are as follows: " + helper.prettyPrintPorts(containerPorts) + " \n\n " +
          "The ports in the test configuration are as follows: " + helper.prettyPrintPorts(ports) + " \n\n " +
          "If the test configuration is correct then remove/add any ports in the configuration that are not in the template \n\n"
        ).to.deep.equal(ports);
      });
    };
  });
});
