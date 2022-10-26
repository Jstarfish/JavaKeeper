'use strict';

const FS		= require('fs');
const PATH	= require('path');

// -----------------------------------------------------------------------------

FS.readdirSync( __dirname )
.filter( e => e.match(/.*\.js/gi) )
.filter( e => ! [ PATH.basename( __filename ) ].includes( e ) )
.filter( e => ! e.match(/^__/gi) )
.forEach( file => exports[ PATH.parse( file ).name ] = require(`./${file}`) );
