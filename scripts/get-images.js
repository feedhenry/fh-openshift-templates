var _ = require("lodash");
var path = require('path');

var argv = require('yargs')
    .usage("Usage: npm run get-images -- -t /path/to/template.json /path/to/template2.json")
    .help('help')
    .option('t', {
      alias: 'templates',
      default: path.resolve(__dirname, '../fh-mbaas-template-3node.json'),
      describe: 'Template files to load',
      type: 'array'
    })
    .option('sudo', {
      default: true,
      describe: 'Prepend sudo to pull commands',
      type: 'boolean'
    })
    .argv;

var templates = Array.isArray(argv.t) ? argv.t : [argv.t];

var NAME_SUFFIX_REGEXP = /_IMAGE$|_IMAGE_VERSION$/;

function namePropertyWithoutSuffix(parameter) {
  return _.replace(parameter.name, NAME_SUFFIX_REGEXP, "");
}

function reduceGroupedParams(paramGroup, accum) {
  return _.reduce(paramGroup, function(result, elem) {
    return result === accum ? result + elem.value : result + ":" + elem.value;
  }, accum);
}

var relevantParameters = _.flatten(_.map(templates, function(t) {
      var template = require(path.resolve(t));
      return _.filter(template.parameters, function(parameter) {
        return parameter.name &&
            _.split(parameter.name, NAME_SUFFIX_REGEXP).length === 2;
      });
    }
));

var groupedComponents = _.groupBy(relevantParameters, namePropertyWithoutSuffix);

var images = _.map(_.values(groupedComponents), function(group) {
  return reduceGroupedParams(group, "");
});

var pullCommand = _.join(_.map(_.values(groupedComponents), function(group) {
  return reduceGroupedParams(group, _.compact([argv.sudo ? 'sudo' : '', 'docker', 'pull ']).join(' '));
}), " && \\\n");

console.log("Docker image tags defined in parameters:");
console.log("---------------------------------------\n");

_.forEach(images, function(image) {
  console.log(image);
});

console.log("\nCommand to pull all images:");
console.log("---------------------------");
console.log(pullCommand);
