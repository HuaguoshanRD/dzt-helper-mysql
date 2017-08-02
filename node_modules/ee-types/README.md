# ee-types

Reliabale type detection

## installation
	
	npm install ee-types

## usage


	var type = require( "ee-types" );


	type.string( "nope" ); 					// true
	type.strign( new String( "yeah" ) ); 	// true
	type.s( "michael" ); 					// true


	type( 2 ) // number


## API

	type() // returns the loawercase type

	type.string()
	type.number()
	type.boolean()
	type.function()
	type.object() 			// array, dates, erors, regexps & sometimes strings, numbers and bools are objects
	type.date()
	type.error()
	type.regexp()
	type.array()
	type.buffer()
	type.null()
	type.undefined()

shortcut methods

	type.s() // string
	type.n() // number
	type.b() // boolean
	type.u() // undefined

check array and their contents. for every type above there is an array method like the one below.

	type.stringArray( [ "hi", new String( "name" ), "is", "michael" ] )	 // true
	type.sa( [ "hi", new String( "name" ), "is", "michael" ] )	 		 // true