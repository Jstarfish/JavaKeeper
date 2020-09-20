'use strict';

const {
	chalk	: CHALK,
	logger: LOGGER
} = require('@vuepress/shared-utils');

// -----------------------------------------------------------------------------

const { name: PLUGIN_NAME } = require('../package.json');

// -----------------------------------------------------------------------------

const LOG = { plugin_name: CHALK.magenta( PLUGIN_NAME ) };

['wait', 'success', 'tip', 'warn', 'error']
.forEach( e => LOG[e] = ( ...args ) => LOGGER[e]( LOG.plugin_name, ...args ) );

// -----------------------------------------------------------------------------

module.exports = LOG;
