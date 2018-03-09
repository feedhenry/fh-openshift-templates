"use strict";

const fs = require("fs");

function main() {
  const PLATFORM_VERSION = process.argv[2];
  const FILENAME         = "rhmap-mbaas-config.json";
  const mbaasConfig      = fs.realpathSync(FILENAME);
  const mbaasConfigJson  = require(mbaasConfig);

  const isInfoMap = o => o.metadata.name === "fh-mbaas-info" && o.kind === "ConfigMap";
  mbaasConfigJson.objects.filter(isInfoMap)[0].data.version = PLATFORM_VERSION;

  fs.writeFileSync(FILENAME, JSON.stringify(mbaasConfigJson, null, 2));
  fs.appendFileSync(FILENAME, '\n');
}

main();
