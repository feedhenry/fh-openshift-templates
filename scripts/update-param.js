var _ = require("lodash");
var fs = require("fs");
var templates = require("../lib/templates.js");

function main() {
  var argv = require('yargs')
      .usage("Usage: npm run update-image -- -p FH_MBAAS_IMAGE_VERSION -v 1.0.1-1")
      .demand(['p','v'])
      .argv;

  var mbaasMulti = fs.realpathSync("fh-mbaas-template-3node.json");
  var mbaasSingle = fs.realpathSync("fh-mbaas-template-1node.json");

  var templateMap = templates.get([mbaasSingle, mbaasMulti]);
  templates.updateParameter(templateMap, argv.p, argv.v);
  templates.write(templateMap);
}

main();
