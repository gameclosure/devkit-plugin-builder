#!/usr/bin/env node
'use strict';

let lazy = require('lazy-cache')(require);
lazy('bluebird', 'Promise');
lazy('devkit-logging', 'logging');


let yargs = require('yargs');
let argv = yargs
  .usage('Usage: $0 <pluginPath> [options]')
  .options('watch', {
    describe: 'Watch for changes and rebuild',
    boolean: true,
    optional: true
  })
  .options('v', {
    describe: 'Enable verbose logging',
    alias: 'verbose',
    boolean: true,
    optional: true
  })
  .options('livereload', {
    describe: 'Use livereload',
    boolean: true,
    optional: true,
    default: true
  })
  .help('h')
  .alias('h', 'help')
  .epilog('Project: https://github.com/gameclosure/devkit-plugin-builder')
  .argv;

if (argv.verbose) {
  lazy.logging.setDefaultLevel('silly');
  lazy.Promise.config({
    longStackTraces: true
  });
}

let pluginBuilder = require('../index');
pluginBuilder.updateOpts(argv);


// MAIN //

let compilePlugin = function(moduleDir, watch, cb) {
  if (watch) {
    pluginBuilder.executeRunnerTask(moduleDir, 'watch', cb);
  } else {
    pluginBuilder.executeRunnerTask(moduleDir, 'compile', cb);
  }
};

if (!argv._ || argv._.length === 0) {
  let logger = lazy.logging.get('pluginBuilder');
  logger.error('Must specify pluginPath as first positional argument');
  process.exit(1);
}

compilePlugin(argv._[0], argv.watch);
