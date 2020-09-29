'use strict';

const _		= { isEmpty: require('lodash.isempty') };

// -----------------------------------------------------------------------------

const LIB = {
	UTIL: require('./UTIL'),
	LOG	: require('./LOG'),
};

// -----------------------------------------------------------------------------

/**
 * Class responsible for preparing a page data to be used as feed item
 */
class Page
{
	
	/**
	 * constructor
	 * 
	 * @param {object} $page
	 * @param {object} options
	 * @param {object} context
	 */
	constructor( $page, options = {}, context )
	{
		
		if ( ! options.canonical_base )
		{
			throw new Error('canonical_base required');
		}

		// -------------------------------------------------------------------------
		
		const { path, regularPath } = $page;
		
		this.path = path || regularPath;
		
		if ( ! this.path )
		{
			throw new Error('path required');
		}

		// -------------------------------------------------------------------------
		
		const {
			
			key,              // page's unique hash key
			frontmatter,      // page's frontmatter object
			//regularPath,    // current page's default link (follow the file hierarchy)
			//path,           // current page's real link (use regularPath when permalink does not exist)
			
			//title,
			//date,
			excerpt,
			
			//_filePath,      // file's absolute path
			//_computed,      // access the client global computed mixins at build time, e.g _computed.$localePath.
			//_content,       // file's raw content string
			_strippedContent, // file's content string without frontmatter
			//_meta,
			
		} = $page;
		
		
		this.$page						= $page;
		this.key							= key;
		this.frontmatter			= frontmatter || {};
		this.feed_settings		= this.frontmatter.feed || {};
		this.excerpt					= excerpt;
		this._strippedContent	= _strippedContent;

		// -------------------------------------------------------------------------
		
		this.options				= options;
		this.canonical_base	= this.options.canonical_base;
		this.feed_options		= this.options.feed_options || {};
		
		// -------------------------------------------------------------------------
		
		this.context = context || {};
		
	}
	// constructor()
	
	
	
	/**
	 * @return {string}
	 */
	url_resolve( path )
	{
		
		if ( this.canonical_base && path )
		{
			return LIB.UTIL.resolve_url( this.canonical_base, path );
		}
	
	}
	// url_resolve()
	
	
	
	/**
	 * @return {string}
	 */
	extract_from_stripped_content( re )
	{
						
		if ( ! this._strippedContent )
		{
			return;
		}

		// -------------------------------------------------------------------------
		
		const regex = LIB.UTIL.get_regex( re );
		
		if ( ! ( regex instanceof RegExp ) )
		{
			return;
		}
		
		let match;
		
		if ( ( match = regex.exec( this._strippedContent ) ) !== null )
		{
			if ( match[1] )
			{
				return match[1];
			}
		}
	
	}
	// extract_from_stripped_content()
	
	
	
	/**
	 * @return {string}
	 */
	get_feed_setting( key, fallback = true )
	{
		
		try {
			
			if ( this.feed_settings.hasOwnProperty( key ) )
			{
				return this.feed_settings[ key ];
			}

			// -----------------------------------------------------------------------
		
			if ( fallback && ! _.isEmpty( this.feed_options[ key ] ) )
			{
				return this.feed_options[ key ];
			}
			
		} catch ( err ) {
			
			LIB.LOG.error( err.message );
			
		}
	
	}
	// get_feed_setting()
	
	
	
	/**
	 * @return {string}
	 */
	get title()
	{
		
		const { title } = this.$page;
	
		return this.feed_settings.title || title;
	
	}
	// get title()
	
	
	
	/**
	 * @return {Date}
	 */
	get date()
	{
		
		const { date } = this.$page;
		
		return ( date ) ? new Date( date ) : new Date();
	
	}
	// get date()
	
	
	
	/**
	 * @return {string}
	 */
	get url()
	{
		
		return this.url_resolve( this.path );
	
	}
	// get url()
	
	
	
	/**
	 * @return {string}
	 */
	get description()
	{
	
		try {
			
			if ( this.feed_settings.hasOwnProperty('description') )
			{
				return this.feed_settings.description;
			}

			// -----------------------------------------------------------------------
		
			if ( _.isEmpty( this.options.description_sources ) )
			{
				return;
			}

			// -----------------------------------------------------------------------
			
			let out = '';
			
			for ( const source of this.options.description_sources )
			{
				switch ( source )
				{
					case 'frontmatter':
						
						out = this.frontmatter.description || '';
						
						break;

					// -------------------------------------------------------------------
					
					case 'excerpt':
						
						out = this.excerpt || '';
						
						break;

					// -------------------------------------------------------------------
					
					default:
			
						// content without frontmatter - used with regex
						
						out = this.extract_from_stripped_content( source );
						
						break;
				}

				// ---------------------------------------------------------------------
				
				if ( ! out )
				{
					continue;
				}

				// ---------------------------------------------------------------------
				
				out = LIB.UTIL.strip_markup( out.trim() );

				// ---------------------------------------------------------------------
				
				if ( out )
				{
					break;
				}
			}

			// -----------------------------------------------------------------------
			
			return out;
			
		} catch ( err ) {
			
			LIB.LOG.error( err.message );
			
		}
	
	}
	// get description()
	
	
	
	/**
	 * @wip
	 * @return {string}
	 */
	get content()
	{
		
		try {
			
			if ( this.feed_settings.hasOwnProperty('content') )
			{
				return this.feed_settings.content;
			}

			// -----------------------------------------------------------------------
			
			if ( _.isEmpty( this.context.markdown ) )
			{
				return;
			}
			
			// @todo: should be generated html from markdown
			
			if ( this._strippedContent )
			{
				const { html } = this.context.markdown.render( this._strippedContent );

				// ---------------------------------------------------------------------
				
				if ( ! html )
				{
					return;
				}

				// ---------------------------------------------------------------------
				
				/*
				// @todo:
				// render vue; {{ }}, vue components, etc...
				// convert relative urls to full urls
				*/

				// ---------------------------------------------------------------------
				
				return html;
			}

			// -----------------------------------------------------------------------
			
			// @consider falling back to excerpt or description
			
		} catch ( err ) {
			
			LIB.LOG.error( err.message );
			
		}
	
	}
	// get content()
	
	
	
	/**
	 * @return {string} image url
	 */
	get image()
	{
	
		try {
			
			if ( this.feed_settings.hasOwnProperty('image') )
			{
				return this.feed_settings.image;
			}

			// -----------------------------------------------------------------------
		
			if ( _.isEmpty( this.options.image_sources ) )
			{
				return;
			}

			// -----------------------------------------------------------------------
			
			let out = '';
			
			for ( const source of this.options.image_sources )
			{
				switch ( source )
				{
					case 'frontmatter':
					
						out = this.frontmatter.image || '';
						
						break;

					// -------------------------------------------------------------------
					
					default:
			
						// content without frontmatter - used with regex
						
						out = this.extract_from_stripped_content( source );
						
						break;
				}

				// ---------------------------------------------------------------------
				
				if ( out )
				{
					out = out.trim();
					
					break;
				}
			}
			
			if ( ! out )
			{
				return;
			}

			// -----------------------------------------------------------------------
			
			// image url as relative path is supported
			
			return ( LIB.UTIL.is_url( out ) ) ? out : this.url_resolve( out );
			
		} catch ( err ) {
			
			LIB.LOG.error( err.message );
			
		}
	
	}
	// get image()
	
	
	
	/**
	 * @return {object}
	 */
	get author()
	{
		
		return this.get_feed_setting('author');
	
	}
	// get author()
	
	
	
	/**
	 * @return {object}
	 */
	get contributor()
	{
		
		return this.get_feed_setting('contributor');
	
	}
	// get contributor()
	
	
	
	/**
	 * @return {object}
	 */
	async get_feed_item()
	{
		
		try {
		
			// we need at least title or description
			
			const title				= this.title;
			const description	= this.description;
			
			if ( ! title && ! description )
			{
				return;
			}

			// -----------------------------------------------------------------------
		
			const url = this.url;
			const out = {
				
				title,
				description,
				id					: url, // @notes: i considered using key, but url is more relevant
				link				: url,
				date				: this.date,
				image				: this.image,

				// ---------------------------------------------------------------------
				
				// @todo:
				// all content is included in item
				// still a wip; needs rendering all vue related syntax
				
				//content: this.content,

				// ---------------------------------------------------------------------
				
				// @notes: the following are handled below
				
				/*
				author			: [],
				contributor	: [],
				*/
			};

			// -----------------------------------------------------------------------
			
			const keys = ['author', 'contributor'];
			
			for ( const key of keys )
			{
				const res = this[ key ];
				
				if ( ! _.isEmpty( res ) )
				{
					out[ key ] = Array.isArray( res ) ? res : [ res ];
				}
			}

			// -----------------------------------------------------------------------
			
			return out;			
			
		} catch ( err ) {
			
			LIB.LOG.error( err.message );
			
		}
	
	}
	// get_feed_item()
	
}
// class Page

// -----------------------------------------------------------------------------

module.exports = Page;
