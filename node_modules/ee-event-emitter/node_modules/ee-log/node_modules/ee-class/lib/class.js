!function(global){
	"use strict";


	/*
	 * the clone method recursively clones varaibles of any type
	 *
	 * @param <Mixed> anything
	 */
	var clone = function(input) {
		var result, i, keys;

		switch (typeof input) {
			case 'object':
				if (Array.isArray(input)) {
					result = input.length > 0 ? input.slice(0) : [];
					i = result.length;
					while(i--) result[i] = clone(result[i]);
				}
				else if (Buffer.isBuffer(input)){
					result = new Buffer(input.length);
					input.copy(result);
				}
				else if (input === null){
					return null;
				}
				else if (input instanceof RegExp){
					return input;
				}
				else {
					result = {};
					keys = Object.keys(input);
					i = keys.length;
					while(i--) result[keys[i]] = clone(input[keys[i]]);
				}
				break;

			default:
				return input;
		}

		return result;
	}
	

	/*
	 * the makeProperties method creates a properties object
	 * that can be consumed by «Object-create» api
	 *
	 * @param <Mixed> anything
	 */
	var makeProperties = function(input) {
		var   properties = {}
			, keys = Object.keys(input)
			, i = keys.length;

		while(i--) {
			properties[keys[i]] = {
				value: input[keys[i]]
				, writable: true
				, configurable: true
				, enumerable: true
			};
		}
		return properties;
	}


	/*
	 * the findProto method seeks the next function of the same name
	 * in the prototype chain, returns it 
	 *
	 * @param <Object> prototype
	 * @param <name> name of the function
	 */
	var findProto = function(proto, name) {
		if (typeof proto[name] === 'function') return proto[name];
		else if (Object.getPrototypeOf(proto)) return findProto(Object.getPrototypeOf(proto), name);
		else null;
	}



	/*
	 * the bindFunctions method binds function on the prototype to 
	 * the given scope (thisObject)
	 *
	 * @param <Object> thisObject
	 * @param <Object> proto to map functions
	 */
	var bindFunctions = function(thisObject, proto) {
		var parent = Object.getPrototypeOf(proto);
		if (!parent) return;
		
		Object.keys(proto).forEach(function(functionName) {
			if (typeof proto[functionName] === 'function') {
				var parentFunction = findProto(parent, functionName);
				if (parentFunction) proto[functionName].parent = parentFunction.bind(thisObject);
			}
		});
	}





	module.exports = function( classDefinition, objectProperties ){
		var   proto 			= {}
			, classProperties 	= {}
			, getters 			= {}
			, setters 			= {}
			, staticProperties 	= {}
			, parentClass, keys, i, id, get, set, setterKeys, getterKeys, staticKeys, o, parent, newObjectProperties;


		// collect inherited data
		if ( classDefinition.inherits ){

			// ee class
			if ( classDefinition.inherits.$$__iridium__$$ ){
				parentClass 		= classDefinition.inherits.$$__iridium__$$;
				proto 				= Object.create( parentClass.proto );
				classProperties 	= clone( parentClass.properties );
				setters 			= clone( parentClass.setters );
				getters				= clone( parentClass.getters );
				staticProperties 	= clone( parentClass.staticProperties );
				parent 				= parentClass.proto;

				if (parentClass.objectProperties) {
					if (objectProperties){
						newObjectProperties = parentClass.objectProperties;
						// copy
						Object.keys(objectProperties).forEach(function(propertyName){
							newObjectProperties[propertyName] = objectProperties[propertyName];
						});
					}
					else objectProperties = parentClass.objectProperties;
				}
			}
			else {
				// js class
				proto 				= Object.create( classDefinition.inherits.prototype );
			}
		}
		

		// extract definition components
		keys = Object.keys( classDefinition );
		i = keys.length;

		while( i-- ){
			( function( id ){
				get = classDefinition.__lookupGetter__( id );
				set = classDefinition.__lookupSetter__( id );

				// separte getters & setters
				if ( get || set ){
					if ( get ) getters[ id ] = get;
					if ( set ) setters[ id ] = set;
				}
				// separate static properties
				else if ( id.indexOf( "static " ) === 0 ){
					staticProperties[ id.substr( 7 ) ] = classDefinition[ id ];
				}
				// the rest
				else if ( id !== "inherits" ){
					switch ( typeof classDefinition[ id ] ){
						case "function":
							proto[ id ] = classDefinition[ id ];
							break;

						default:
							classProperties[ id ] = classDefinition[ id ];
							break;
					}
				}
			}.bind( this ) )( keys[ i ] );
		}


		// get keys of the props
		setterKeys = Object.keys( setters );
		getterKeys = Object.keys( getters );



		// this is the actual class contructor
		var ClassConstructor = function( options ){
			// instantiate the class with its prototype and porperties
			// wee need to clone the properties so the properties
			// typeof object wont be shared between the instances
			var instance = Object.create( proto, makeProperties( clone( classProperties ) ) )
				, k = setterKeys.length
				, m = getterKeys.length
				, contructorResult;

			// add setters and getters
			while( m-- ) instance.__defineGetter__( getterKeys[ m ], getters[ getterKeys[ m ] ] );
			while( k-- ) instance.__defineSetter__( setterKeys[ k ], setters[ setterKeys[ k ] ] );

			// add eventlisteners
			if ( options && options.on && typeof instance.on === "function" ) instance.on( options.on );

	
			// bind super functions to current function
			var binder = function( proto ){
				var protoType = Object.getPrototypeOf(proto); 
				if(protoType) {
					bindFunctions(instance, protoType);
					binder(protoType);
				}
			}
			binder( instance );

			// object properties
			if (objectProperties) Object.defineProperties(instance, objectProperties);

		
			// call the class contsructor
			if ( typeof instance.init === "function" ){
				contructorResult = ( arguments.length > 1 ) ? instance.init.apply( instance, Array.prototype.slice.call( arguments ) ) : instance.init( options );
				if ( typeof contructorResult === "object" || typeof contructorResult === "function" ) instance = contructorResult;
			}

			// thats it :)
			return instance;
		};


		// add static properties
		staticKeys = Object.keys( staticProperties );
		o = staticKeys.length;
		while( o-- ) ClassConstructor[ staticKeys[ o ] ] = staticProperties[ staticKeys[ o ] ];


		// store class components
		Object.defineProperty( ClassConstructor, "$$__iridium__$$", { value: {
			  proto: 			proto
			, properties: 		classProperties
			, setters: 			setters
			, getters: 			getters
			, staticProperties: staticProperties	
		} } );

		ClassConstructor.definition = classDefinition;

		return ClassConstructor;
	}
}(this);

/*
	var Class = module.exports = function(classDefinition){
		// first we need to separate properties from the functions.
		// functions go on to the prototype, properties are copied
		// on to every instance of the class. the definition 


		var ClassConstructor = function(options){

			// call the class constructor?
			if (typeof this.init === 'function') {
				var ret = this.init(options);
				if (ret instanceof Object) return ret;
				else return Object.create(this, {});
			}
		};

		ClassConstructor.prototype = Class;


		return ClassConstructor;
	};*/