var _ = require("lodash");
var fs = require("fs");

function get(files) {
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


function write(templates) {
  _.forEach(templates, function(template) {
    fs.writeFileSync(template.name, JSON.stringify(template.contents, null, 2));
  });
}

function updateParameter(templates, paramName, newValue) {
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

module.exports = {
  get: get,
  write: write,
  updateParameter: updateParameter
};
