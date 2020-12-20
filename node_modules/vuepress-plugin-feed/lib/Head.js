'use strict';

const _ = { isEmpty: require('lodash.isempty') };

// -----------------------------------------------------------------------------

const { chalk: CHALK } = require('@vuepress/shared-utils');

// -----------------------------------------------------------------------------

const LIB = {
	LOG	: require('./LOG'),
	UTIL: require('./UTIL'),
};

// -----------------------------------------------------------------------------

/**
 * Class responsible for adding links to head
 */
class Head
{

	/**
	 * constructor
	 *
	 * @param {object} options
	 * @param {object} context
	 */
	constructor( options = {}, context )
	{

		if ( ! options.canonical_base )
		{
			throw new Error('canonical_base required');
		}

		// -------------------------------------------------------------------------

		this.options				= options;
		this.canonical_base	= this.options.canonical_base;
		this.feeds					= this.options.feeds || {};
		this._internal			= this.options._internal || {};

		// -------------------------------------------------------------------------

		this.context = context || {};

	}
	// constructor()



	/**
	 * @return {string}
	 */
	get_feed_url( feed )
	{

		if ( feed.head_link.enable && feed.enable && feed.file_name )
		{
			return LIB.UTIL.resolve_url( this.canonical_base, feed.file_name );
		}

	}
	// get_feed_url()



	/**
	 * @return {array}
	 */
	get_link_item( feed, site_title = '' )
	{

		try {

			const href = this.get_feed_url( feed );

			if ( ! href )
			{
				return;
			}

			// -----------------------------------------------------------------------

			const { type, title }	= feed.head_link;

			return [
				'link',
				{
					rel		: 'alternate',
					type,
					href,
					title	: title.replace( '%%site_title%%', site_title ),
				}
			];

		} catch ( err ) {

			LIB.LOG.error( err.message );

		}

	}
	// get_link_item()



	/**
	 * @return {array|undefined}
	 */
	async add_links()
	{

		try {

			if ( _.isEmpty( this.feeds ) )
			{
				return;
			}

			// -----------------------------------------------------------------------

			const { siteConfig = {} } = this.context;

			siteConfig.head		= siteConfig.head || [];
			const site_title	= siteConfig.title || '';

			// -----------------------------------------------------------------------

			const out = [];

			for ( const key of Object.keys( this.feeds ) )
			{
				if ( ! this._internal.allowed_feed_types.includes( key ) )
				{
					continue;
				}

				// ---------------------------------------------------------------------

				const item = this.get_link_item( this.feeds[ key ], site_title );

				if ( _.isEmpty( item ) )
				{
					continue;
				}

				siteConfig.head.push( item );

				LIB.LOG.success(`${key} link added to ${CHALK.cyan('siteConfig.head')}`);

				// ---------------------------------------------------------------------

				out.push( item );
			}

			// -----------------------------------------------------------------------

			return out;

		} catch ( err ) {

			LIB.LOG.error( err.message );

		}

	}
	// add_links()

}
// class Head

// -----------------------------------------------------------------------------

module.exports = Head;
