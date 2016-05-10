var _ = require("lodash");
var template = require("../fh-mbaas-template-1node.json");

var NAME_SUFFIX_REGEXP = /_IMAGE$|_IMAGE_VERSION$/;

function namePropertyWithoutSuffix(parameter) {
  return _.replace(parameter.name, NAME_SUFFIX_REGEXP, "");
}

function reduceGroupedParams(paramGroup, accum) {
  return _.reduce(paramGroup, function(result, elem) {
    return result === accum ? result + elem.value : result + ":" + elem.value;
  }, accum);
}

var relevantParameters = _.filter(template.parameters, function(parameter) {
  return parameter.name &&
    _.split(parameter.name, NAME_SUFFIX_REGEXP).length === 2;
});

var groupedComponents = _.groupBy(relevantParameters, namePropertyWithoutSuffix);

var images = _.map(_.values(groupedComponents), function(group) {
  return reduceGroupedParams(group, "");
});

var pullCommand = _.join(_.map(_.values(groupedComponents), function(group) {
  return reduceGroupedParams(group, "sudo docker pull ");
}), " && \\\n");

console.log("Docker image tags defined in parameters:");
console.log("---------------------------------------\n");

_.forEach(images, function(image) {
  console.log(image);
});

console.log("\nCommand to pull all images:");
console.log("---------------------------");
console.log(pullCommand);
