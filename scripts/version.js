var fs = require("fs");
var _ = require("lodash");
var templates = require("../lib/templates.js");

var version = require(fs.realpathSync("package.json")).version;
var mbaasMulti = fs.realpathSync("fh-mbaas-template-3node.json");
var mbaasSingle = fs.realpathSync("fh-mbaas-template-1node.json");

var templateMap = templates.get([mbaasMulti, mbaasSingle]);
_.forEach(templateMap, function(template) {
  template.contents.metadata.annotations.templateVersion = version;
});

templates.write(templateMap);
