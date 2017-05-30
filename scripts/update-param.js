var _ = require("lodash");
var fs = require("fs");
var templates = require("../lib/templates.js");

function main() {
  var argv = require('yargs')
      .usage("Usage: npm run update-param -- -p FH_MBAAS_IMAGE_VERSION -v 1.0.1-1")
      .demand(['p', 'v'])
      .argv;

  var mbaasMulti = fs.realpathSync("mongo-replica.json");
  var mbaasSingle = fs.realpathSync("mongo-standalone.json");
  var mbaasSingleNonPersistent = fs.realpathSync("mongo-standalone-ephemeral.json");
  var mbaasComponents = fs.realpathSync("fh-mbaas-components.json");

  var templateMap = templates.get([
    mbaasMulti,
    mbaasSingle,
    mbaasSingleNonPersistent,
    mbaasComponents
  ]);

  templates.updateParameter(templateMap, argv.p, argv.v);
  templates.write(templateMap);
}

main();
