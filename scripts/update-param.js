'use strict';

const _         = require("lodash");
const fs        = require("fs");
const templates = require("../lib/templates.js");

function main() {
  const argv = require('yargs')
      .usage("Usage: npm run update-param -- -p FH_MBAAS_IMAGE_VERSION -v 1.0.1-1")
      .demand(['p', 'v'])
      .argv;

  const templateMap = templates.get([
    fs.realpathSync("mongo-replica.json"),
    fs.realpathSync("mongo-standalone.json"),
    fs.realpathSync("rhmap-mbaas-config.json"),
    fs.realpathSync("fh-mbaas-components.json"),
    fs.realpathSync("mongo-replica-affinity.json"),
    fs.realpathSync("mongo-standalone-ephemeral.json")
  ]);

  templates.updateParameter(templateMap, argv.p, argv.v);
  templates.write(templateMap);
}

main();
