


	var   Class 	= require( "./" )
		, assert 	= require( "assert" );



	var LifeForm = new Class( {
		inherits: Array
		
		, isAlive: false

		, init: function( options ){
			this.isAlive = !!options.isAlive;
		}



		, over: function(){
			//console.log('over lifeform');
		}
	} );




	var Human = new Class( {
		inherits: LifeForm
		
		, name: ""

		, init: function init( options ){
			init.parent( options );
			this.name = options.name;
		}


		, over: function(){
			//console.log('over human');
		}
	} );



	var Boy = new Class( {
		inherits: Human

		, age: 0

		, init: function init( options ){
			init.parent( options );
			this.age = options.age;
		}


		, describe: function(){
			//console.log( "Hi, my name is %s, i'm %s years old and i'm " + ( this.isAlive ? "alive :)" : "dead :(" ), this.name, this.age );
			assert.equal( this.age, 15, "The «age» property was not set!");
			assert.equal( this.name, "fabian", "The «fabian» property was not set!");
			assert.equal( this.isAlive, true, "The «alive» property was not set!");
		}

		, over: function(){
			//console.log('over boy');
		}
	} );




	var fabian = new Boy( {
		  name: "fabian"
		, age: 15
		, isAlive: true
	} );

	fabian.describe();

	fabian.over();




	var MyClass = new Class({
        init: function(){

        }
    }, 
    { 
    	_values: {
            value: {
                name: 'john doe'
            }
        }
        , name: {
            get: function(){
                return this._values.name;
            }
            , set: function(newValue){
                this._values.name = newValue;
                //console.log('set new value', newValue);
            }
            , enumerable: true
        }
    });

    var x = new MyClass();

    x.name = 'michael';
   // console.log(x.name);
	//console.log( fabian instanceof LifeForm);