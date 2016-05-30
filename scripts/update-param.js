var _ = require("lodash");
var fs = require("fs");
var templates = require("../lib/templates.js");

function main() {
  var argv = require('yargs')
      .usage("Usage: npm run update-param -- -p FH_MBAAS_IMAGE_VERSION -v 1.0.1-1")
      .demand(['p', 'v'])
      .argv;

  var mbaasMulti = fs.realpathSync("fh-mbaas-template-3node.json");
  var mbaasSingle = fs.realpathSync("fh-mbaas-template-1node.json");

  var fhScmSingle = fs.realpathSync("fh-scm-single-template.json");
  var fhSupercoreSingle = fs.realpathSync("fh-supercore-single-template.json");

  var templateMap = templates.get([
    mbaasSingle,
    mbaasMulti,
    fhScmSingle,
    fhSupercoreSingle
  ]);

  templates.updateParameter(templateMap, argv.p, argv.v);
  templates.write(templateMap);
}

main();
