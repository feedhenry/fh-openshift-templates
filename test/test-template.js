var expect = require('chai').expect;
var withData = require('leche').withData;
var helper = require('./helper');
var suites = require('./suites');
var _ = require('lodash');

// Default tests to the all component suite
var componentSuite = suites['component'];
var params = ['component'];

if (process.env.npm_config_suite) {
  params = process.env.npm_config_suite.split(' ');

  if(helper.has(suites, params)) {
    // Retrieve leche component suite from suites.js
    componentSuite = {};
    _.forEach(params, function (param) {
      _.extend(componentSuite, suites[param]);
    });
  } else {
    process.exit(1);
  }
}

describe('Openshift Template on component suite(s) "' + params.join(', ') + '"', function() {
  // Run each test with the selected suite of components
  withData(componentSuite, function (template, options) {

    it('should have a parameter for each env var', function () {
      var paramNames = _.map(template.parameters, 'name');

      var envValues = helper.parseEnvValues(helper.findEnvVars(template, options));

      var diff = _.difference(envValues, paramNames);

      // Env var values should be a subset of parameter names, not equal
      expect(
        diff.length,
        'Missing parameters for environment variables ' + diff.join(', ')
      ).to.equal(0);
    });

    it('should have the correct corresponding label in the DeploymentConfig', function () {
      var deploymentConfigLabels = helper.findLabelNames(template);

      var serviceNames = helper.findServiceNames(template);

      var diff = _.xor(deploymentConfigLabels, serviceNames);

      // Labels should match completely
      expect(
        deploymentConfigLabels,
        'Missing labels ' + diff.join(', ')
      ).to.deep.equal(serviceNames);
    });

    it('should have a corresponding volume mount for each volume definition', function () {
      var volumeMounts = helper.findVolumeMounts(template);

      var volumeDefinitions = helper.findVolumeDefinitions(template);

      var diff = _.xor(volumeDefinitions, volumeMounts);

      // Volume mounts and definitions should match completely
      expect(
        volumeMounts,
        'Missing volume mount/claim pairs for ' + diff.join(', ')
      ).to.deep.equal(volumeDefinitions);
    });

    it('should have matching service ports and container ports', function () {
      var containerPorts = helper.findContainerPorts(template);

      var servicePorts = helper.findServicePorts(template);

      var diff = _.differenceWith(servicePorts, containerPorts, _.isEqual);

      // Container ports and service ports should match completely
      expect(
        diff.length,
        'Service and container ports do not match, ports are ' + _.map(diff,'containerPort').join(', ')
      ).to.equal(0);
    });

    if (options && options.ports) {
      it('should have the correct ports opened', function () {
        var containerPorts = helper.findContainerPorts(template);

        var ports = _.map(options.ports, function (port) {
          return _.extend({protocol: 'TCP'}, port);
        });
        // Ports in config are exactly equal to container ports
        var diff = _.xor(ports, containerPorts);

        // Ports in config are subset of container ports
        //var diff = _.differenceWith(ports, containerPorts, _.isEqual);
        // Container ports should match defined ports completely
        // because of the Service and container ports should match test
        // this means that the service ports are covered in this test too
        expect(
          containerPorts,
          'Missing ports defined '+_.map(diff, 'port').join(', ')
        ).to.deep.equal(ports);
      });
    };
  });
});
