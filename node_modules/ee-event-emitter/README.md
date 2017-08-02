# ee-events

## installation

	npm install ee-events

	if an «error» event is emitted and there is no listenr for the error event a stacktrace is printed and the application exits.


## API

	var EventEmitter = require( "ee-event-emitter" );
	var eventEmitter = new EventEmitter();

	// attach listener
	eventEmitter.on( "eventName", cb );

	// attach listsner which is called once
	eventEmitter.once( "eventName", cb );

	// remove all listeners for all events
	eventEmitter.off();

	// remove listeners for specific event
	eventEmitter.off( "eventName" );

	// remove a single listener
	eventEmitter.off( "eventName", listener );

	// emit an event
	eventEmitter.emit( "eventName", arg, arg, .... );

	// get all listeners
	eventEmitter.listener();

	// get lsisteners for a specific event
	eventEmitter.listsner( "eventName" );

	// event which is emitted when an event listener is added
	eventEmitter.on( "listener", function( eventName, listener ){} );

	// event which is emitted when an event listener is removed
	eventEmitter.on( "removeListener", function( eventName, listener ){} );


## usage


	var   Class     		= require( "ee-class" )
    	, EventEmitter    	= require( "ee-event-emitter" );


	var Human = new Class( {
	    inherits: EventEmitter
	    , name: ""
	    , age: 29

	    , init: function( options ){
	        this.name = options.name;
	    }


	    , sayHello: function( to ){
	        this.emit( "startHello" );
	        console.log( "Hi %s, my name is %s, i'm %s years old.", to, this.name, this.age );
	        this.emit( "endHello" );
	    }
	} );



	var Boy = new Class( {
	    inherits: Human
	    , age: 12
	} );


	var fabian = new Boy( { 
	    name: "Fabian" 
	    , on: {
	          startHello: function(){ console.log( "starting console output:" ); }
	        , endHello: function(){ console.log( "finished console output!" ); }
	    }
	} );


	fabian.sayHello( "michael" );  // starting console output:
	                    // Hi my name is Fabian and i'm 12 years old.
	                    // finished console output!



# Version History

- 0.1.0: initial version