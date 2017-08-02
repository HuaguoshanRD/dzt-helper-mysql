

	var util 	= require( "util" )
		Class 	= require( "ee-class" );


	var Types = new Class( {

		init: function(){
			[ "string", "number", "boolean", "array", "object", "function", "date", "regexp", "error", "undefined", "buffer", "null" ].forEach( function( type ){
				this[ type + "Array" ] = function( arg ){
					return this.__array( arg, type );
				}.bind( this );

				if ( type === "string" || type === "number" || type === "boolean" || type === "undefined" ){
					this[ type.substr( 0, 1 ) ] = this[ type ].bind( this );				
					this[ type.substr( 0, 1 ) + "a" ] = this[ type + "Array" ].bind( this );
				}
			}.bind( this ) );
		}

		, string: 		function( arg ){ return typeof arg === "string" || Object.prototype.toString.call( arg ) === "[object String]"; }
		, number: 		function( arg ){ return typeof arg === "number" || Object.prototype.toString.call( arg ) === "[object Number]"; }
		, boolean: 		function( arg ){ return typeof arg === "boolean" || Object.prototype.toString.call( arg ) === "[object Boolean]"; }
		, array: 		function( arg ){ return util.isArray( arg ); }
		, object: 		function( arg ){ return typeof arg === "object" }
		, function: 	function( arg ){ return typeof arg === "function" }
		, date: 		function( arg ){ return util.isDate( arg ); }
		, regexp: 		function( arg ){ return util.isRegExp( arg ); }
		, error: 		function( arg ){ return util.isError( arg ); }
		, undefined: 	function( arg ){ return typeof arg === "undefined" }
		, buffer: 		function( arg ){ return Buffer.isBuffer( arg );  }
		, null: 		function( arg ){ return null === arg; }


		, __array: function( arg, type ){
			if ( !this.array( arg ) ) return false;
			var i = arg.length;
			while( i-- ) if ( !this[ type ]( arg[ i ] ) ) return false;
			return true;			
		}
	} );

	

	var   types = new Types()
		, proto = Object.getPrototypeOf(types);

	var type = function( item ){
		return types.s( item ) ? "string" : 
			   types.n( item ) ? "number" :
			   types.b( item ) ? "boolean" :
			   types.array( item ) ? "array" :
			   types.function( item ) ? "function" :
			   types.date( item ) ? "date" :
			   types.regexp( item ) ? "regexp" :
			   types.error( item ) ? "error" :
			   types.buffer( item ) ? "buffer" :
			   types.null( item ) ? "null" :
			   types.u( item ) ? "undefined" :
			   types.object( item ) ? "object" : "unknown";
	};



	Object.keys(proto).forEach(function(key){
		if (!type[key]) type[key] = types[key].bind(types);
		else throw new Error('Failed to map property «'+key+'» of types to type :(');
	});

	Object.keys(types).forEach(function(key){
		if (!type[key]) type[key] = types[key];
		else throw new Error('Failed to map property «'+key+'» of types to type :(');
	});


	module.exports = type;