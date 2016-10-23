'use strict';

const _ = require('lodash');
const path = require('path');

const argv = require('yargs')
      .usage('Usage: npm run get-images [-- [--sudo true] [--templates template.json...]]')
      .help('help')
      .option('sudo', {
        default: true,
        describe: 'Prepend sudo to pull commands',
        type: 'boolean'
      })
      .option('t', {
        alias: 'templates',
        default: [path.resolve(__dirname, '../fh-mbaas-template-3node.json')],
        describe: 'Template files to load',
        type: 'array'
      })
      .argv;

const SUFFIX_REGEXP = /_IMAGE$|_IMAGE_VERSION$/;
const templates = Array.isArray(argv.t) ? argv.t : [argv.t];
const prefix = argv.sudo ? 'sudo docker pull ' : 'docker pull ';

const relevantParameters = templates
      .map(t => require(path.resolve(t)))
      .map(t => t.parameters
           .filter(p => p.name && p.name.split(SUFFIX_REGEXP).length === 2))
      .reduce((prev, cur) => prev.concat(cur), []);

const groupedComponents = _.groupBy(relevantParameters, namePropertyWithoutSuffix);

function namePropertyWithoutSuffix(parameter) {
  return _.replace(parameter.name, SUFFIX_REGEXP, '');
}

function reduceGroupedParams(paramGroup, accum) {
  return paramGroup.reduce(
    (prev, cur) => prev === accum ? `${prev}${cur.value}` : `${prev}:${cur.value}`, accum);
}

function stringifyGroupedComponents(groupedComponents, linePrefix, lineSeparator) {
  return _.values(groupedComponents)
    .map(g => reduceGroupedParams(g, linePrefix))
    .join(lineSeparator);
}

console.log('Docker image tags defined in parameters:\n' +
            '----------------------------------------\n' +
            stringifyGroupedComponents(groupedComponents, '', '\n') +
            '\n\nCommand to pull all images:' +
            '\n---------------------------\n' +
            stringifyGroupedComponents(groupedComponents, prefix, ' && \\\n'));
