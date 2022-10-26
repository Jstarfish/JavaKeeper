'use strict';

// -----------------------------------------------------------------------------

const REMOVE_MARKDOWN	= require('remove-markdown');
const STRIPTAGS				= require('striptags');
const _								= {
	trimEnd		: require('lodash.trimend'),
	trimStart	: require('lodash.trimstart'),
};

// -----------------------------------------------------------------------------

const UTIL = {};

// -----------------------------------------------------------------------------


/**
 * @return {string}
 */
UTIL.resolve_url = ( base, path ) => `${_.trimEnd( base, '/' )}/${_.trimStart( path, '/' )}`;


/**
 * @return {string}
 */
UTIL.strip_markup = str => STRIPTAGS( REMOVE_MARKDOWN( str, { useImgAltText: false } ) );



/**
 * @return {RegExp}
 */
UTIL.get_regex = re => ( Array.isArray( re ) ) ? new RegExp( ...re ) : re;



/**
 * check if string is a valid url
 *
 * @param {string} maybe_url
 * @return {bool}
 */
UTIL.is_url = ( maybe_url ) =>
{

	if ( ! maybe_url || typeof maybe_url !== 'string' )
	{
		return false;
	}

	// ---------------------------------------------------------------------------

	const re_protocol_and_domain = /^(?:\w+:)?\/\/(\S+)$/;

	const match = maybe_url.match( re_protocol_and_domain );

	if ( ! match )
	{
		return false;
	}

	// ---------------------------------------------------------------------------

	const all_after_protocol = match[1];

	if ( ! all_after_protocol )
	{
		return false;
	}

	// ---------------------------------------------------------------------------

	const re_domain_localhost			= /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/
	const re_domain_non_localhost	= /^[^\s\.]+\.\S{2,}$/;

	return ( 		re_domain_localhost.test( all_after_protocol )
					 || re_domain_non_localhost.test( all_after_protocol ) );

}
// UTIL.is_url()

// -----------------------------------------------------------------------------

module.exports = UTIL;
