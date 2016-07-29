var _ = require('lodash');
var requireDir = require('require-dir');

var componentGroups;
var allComponents;

// Import all modules in ./suites and add them to the template suite list
_.forEach(requireDir('./components'), function (value, key) {
  _.forEach(value, function(value, key) {
    if (_.size(value) === 1) {
      allComponents = _.extend({}, allComponents, value);
    }
  });
  componentGroups = _.extend({}, componentGroups, value);
});

var components = {
  buildSuiteConfig: function (componentGroups) {
    // Templates from the component suites in ./suites/
    _.extend(this, componentGroups);

    // All single components
    this.all = allComponents;

    // We don't want to pollute the component suite
    delete this.buildSuiteConfig;
    return this;
  }
}.buildSuiteConfig(componentGroups);

module.exports = components;
