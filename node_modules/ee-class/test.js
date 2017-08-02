
	
	

	var   Class 	= require( "./" )
		, util 		= require('util')
		, assert 	= require( "assert" );

		console.log(util.inspect(Class('visible string').enumerable(), { showHidden: true, depth: 500,  colors: true }));
/*
var y = Object.create(null, {id:{value:4, enumerable:true}, go: {value: function(){console.dir(1212)}}})
	, x = Object.create(y, {name:{value:9, enumerable:true}});

console.log(util.inspect(Object.getPrototypeOf(x), { showHidden: true, depth: 500,  colors: true }));
x.go();
return;*/





	var LifeForm = new Class( {
		inherits: Array
		
		, isAlive: false
		, age: 0
		, name: 'ficken'

		, init: function lifeform( options ){

			this.isAlive = !!options.isAlive;
			this.age = options.age;			
			this.name = options.name;

			//console.log(util.inspect(this, { showHidden: true, depth: null,  colors: true }));
		}
	} );





	var Human = new Class( {
		inherits: LifeForm
		

		/*, init: function human( options ){
			console.log('human', options);
			
			human.super.call(this, options);
			console.log(util.inspect(this, { showHidden: true, depth: null,  colors: true }));
		}*/
	} );





	var Boy = new Class( {
		inherits: Human


		, init: function boy( options ){

			boy.super.call(this, options);
			
			//console.log(util.inspect(this, { showHidden: true, depth: null,  colors: true }));
		}


		, describe: function(){
			console.log( "Hi, my name is %s, i'm %s years old and i'm " + ( this.isAlive ? "alive :)" : "dead :(" ), this.name, this.age );
			//assert.equal( this.age, 15, "The «age» property was not set!");
			//assert.equal( this.name, "fabian", "The «fabian» property was not set!");
			//assert.equal( this.isAlive, true, "The «alive» property was not set!");
		}
	} );





	var fabian = new Boy( {
		  name: "fabian"
		, age: 15
		, isAlive: true
	} );

	fabian.describe();


	//console.log(util.inspect(fabian.__proto__.__proto__.__proto__, { showHidden: true, depth: 50,  colors: true }));

