var _ = require('lodash');
var requireDir = require('require-dir');

var componentSuites;
var allComponents;

// Import all modules in ./suites and add them to the template suite list
_.forEach(requireDir('./suites'), function (value, key) {
  _.forEach(value, function(value, key) {
    if (_.size(value) === 1) {
      allComponents = _.extend({}, allComponents, value);
    }
  });
  componentSuites = _.extend({}, componentSuites, value);
});

var suites = {
  buildSuiteConfig: function (componentSuites) {
    // Templates from the component suites in ./suites/
    _.extend(this, componentSuites);

    // All single components
    this.component = allComponents;

    // We don't want to pollute the component suite
    delete this.buildSuiteConfig;
    return this;
  }
}.buildSuiteConfig(componentSuites);

module.exports = suites;
