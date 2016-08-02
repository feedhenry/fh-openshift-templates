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

  var fhAppstoreSingle = fs.realpathSync("fh-appstore-single-template.json");
  var fhAAASingle = fs.realpathSync("fh-aaa-single-template.json");
  var fhMessagingSingle = fs.realpathSync("fh-messaging-single-template.json");
  var fhMetricsSingle = fs.realpathSync("fh-metrics-single-template.json");
  var fhNguiSingle = fs.realpathSync("fh-ngui-single-template.json");
  var fhScmSingle = fs.realpathSync("fh-scm-single-template.json");
  var fhSupercoreSingle = fs.realpathSync("fh-supercore-single-template.json");
  var millicore = fs.realpathSync("fh-millicore-single-template.json");
  var ups = fs.realpathSync("unifiedpush-single-template.json");

  var gitlabShell = fs.realpathSync("gitlab-shell/gitlab-shell-single-template.json");
  var httpd = fs.realpathSync("apache-httpd/httpd24-template.json");
  var memcached = fs.realpathSync("memcached/memcached-template.json");
  var mongodb = fs.realpathSync("mongodb/mongodb-core-single-template.json");
  var mysqlPersistent = fs.realpathSync("mysql/mysql-non-persistent-template.json");
  var mysqlNonPersistent = fs.realpathSync("mysql/mysql-persistent-template.json");
  var nagios = fs.realpathSync("nagios/nagios-template.json");
  var redis = fs.realpathSync("redis/redis-template.json");

  var templateMap = templates.get([
    mbaasMulti,
    mbaasSingle,
    fhAppstoreSingle,
    fhAAASingle,
    fhMessagingSingle,
    fhMetricsSingle,
    fhNguiSingle,
    fhScmSingle,
    fhSupercoreSingle,
    millicore,
    gitlabShell,
    httpd,
    memcached,
    mongodb,
    mysqlPersistent,
    mysqlNonPersistent,
    nagios,
    redis,
    ups
  ]);

  templates.updateParameter(templateMap, argv.p, argv.v);
  templates.write(templateMap);
}

main();
