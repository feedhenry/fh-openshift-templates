var _ = require("lodash");
var fs = require("fs");

function getTemplates(files) {
  return _.map(files, function(file) {
    try {
      fs.statSync(file);
    } catch (e) {
      console.error("ERROR:", e);
      return {};
    }

    if (!fs.statSync(file).isFile()) {
      console.warn(file, "is not a file");
      return {};
    }
    return { name: file, contents: require(file) };
  });
}

function writeTemplates(templates) {
  _.forEach(templates, function(template) {
    fs.writeFileSync(template.name, JSON.stringify(template.contents, null, 2));
  });
}

function findAndUpdateParameter(templates, paramName, newValue) {
  _.forEach(templates, function(template) {
    var param = _.find(template.contents.parameters, function(candidate) {
      return candidate.name && candidate.name == paramName;
    });
    if (param) {
      param.value = newValue;
    } else {
      console.warn(paramName, "not found in", template.name);
    }
  });
}

function main() {
  var argv = require('yargs')
      .usage("Usage: npm run update-image -- -p FH_MBAAS_IMAGE_VERSION -v 1.0.1-1")
      .demand(['p','v'])
      .argv;

  var mbaasMulti = fs.realpathSync("fh-mbaas-template-3node.json");
  var mbaasSingle = fs.realpathSync("fh-mbaas-template-1node.json");

  var templates = getTemplates([mbaasSingle, mbaasMulti]);
  findAndUpdateParameter(templates, argv.p, argv.v);
  writeTemplates(templates);
}

main();
