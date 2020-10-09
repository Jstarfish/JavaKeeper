'use strict';

const _ = {
	isEmpty: require('lodash.isempty'),
};

// -----------------------------------------------------------------------------

const {
	path	: PATH,
	fs		: FSE,
	chalk	: CHALK
} = require('@vuepress/shared-utils');

// -----------------------------------------------------------------------------

const LIB = {
	UTIL: require('./UTIL'),
	LOG	: require('./LOG'),
	Page: require('./Page'),
};

// -----------------------------------------------------------------------------

const FEED = require('feed').Feed;

// -----------------------------------------------------------------------------

/**
 * Class responsible for generating the feed xml/json files
 */
class Generator
{

	/**
	 * constructor
	 *
	 * @param {array} pages
	 * @param {object} options
	 * @param {object} context
	 */
	constructor( pages, options = {}, context )
	{

		if ( _.isEmpty( pages ) )
		{
			throw new Error('pages required');
		}

		if ( ! options.canonical_base )
		{
			throw new Error('canonical_base required');
		}

		// -------------------------------------------------------------------------

		this.pages = pages;

		// -------------------------------------------------------------------------

		this.options				= options;
		this.canonical_base	= this.options.canonical_base;
		this.feed_options		= this.options.feed_options || {};
		this.feeds					= this.options.feeds || {};
		this._internal			= this.options._internal || {};

		// -------------------------------------------------------------------------

		this.context = context || {};

		// -------------------------------------------------------------------------

		this.feed_generator = new FEED( this.feed_options );

	}
	// constructor()



	/**
	 * @return null
	 */
	async add_items()
	{

		try {

			const pages = this.options.sort(this.pages).slice( 0, this.options.count );

			LIB.LOG.wait('Adding pages/posts as feed items...');

			const out = [];

			for ( const page of pages )
			{
				const item = await new LIB.Page( page, this.options, this.context ).get_feed_item();

				if ( ! _.isEmpty( item ) )
				{
					this.feed_generator.addItem( item );

					out.push( item );
				}
			}

			// -----------------------------------------------------------------------

			if ( ! _.isEmpty( out ) )
			{
				LIB.LOG.success(`added ${CHALK.cyan( out.length + ' page(s)' )} as feed item(s)`);
			}

			// -----------------------------------------------------------------------

			return out;

		} catch ( err ) {

			LIB.LOG.error( err.message );

		}

	}
	// add_items()



	/**
	 * @return null
	 */
	add_categories()
	{

		try {

			const { category } = this.options;

			if ( category )
			{
				const categories = Array.isArray( category ) ? category : [ category ];

				categories.map( e => this.feed_generator.addCategory( e ) );
			}

		} catch ( err ) {

			LIB.LOG.error( err.message );

		}

	}
	// add_categories()



	/**
	 * @return null
	 */
	add_contributors()
	{

		try {

			const { contributor } = this.options;

			if ( contributor )
			{
				const contributors = Array.isArray( contributor ) ? contributor : [ contributor ];

				contributors.map( e => this.feed_generator.addContributor( e ) );
			}

		} catch ( err ) {

			LIB.LOG.error( err.message );

		}

	}
	// add_contributors()



	/**
	 * @return {array}
	 */
	async generate_files()
	{

		try {

			LIB.LOG.wait('Checking feeds that need to be generated...');

			if ( _.isEmpty( this.feeds ) )
			{
				LIB.LOG.warn('no feeds set - aborting');

				return;
			}

			// -----------------------------------------------------------------------

			const { outDir, cwd } = this.context;

			const feeds	= this.feeds;
			const out		= [];

			for ( const key of Object.keys( feeds ) )
			{
				if ( ! this._internal.allowed_feed_types.includes( key ) )
				{
					continue;
				}

				// ---------------------------------------------------------------------

				const feed = feeds[ key ];

				if ( ! feed.enable || ! feed.file_name )
				{
					continue;
				}

				// ---------------------------------------------------------------------

				const content		= this.feed_generator[ key ]();
				const file			= PATH.resolve( outDir, feed.file_name );
				const relative	= PATH.relative( cwd, file );

				await FSE.outputFile( file, content );

				LIB.LOG.success(`${key} feed file generated and saved to ${CHALK.cyan( relative )}`);

				// ---------------------------------------------------------------------

				out.push( file );
			}

			// -----------------------------------------------------------------------

			return out;

		} catch ( err ) {

			LIB.LOG.error( err.message );

		}

	}
	// generate_files()



	/**
	 * @return {array}
	 */
	async generate()
	{

		try {

			await this.add_items();

			this.add_categories();

			this.add_contributors();

			const files = await this.generate_files();

			return files;

		} catch ( err ) {

			LIB.LOG.error( err.message );

		}

	}
	// generate()

}
// class Generator

// -----------------------------------------------------------------------------

module.exports = Generator;
