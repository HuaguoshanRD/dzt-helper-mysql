


    var   Class     = require('../')
        , util      = require('util')
        , assert    = require('assert');



    describe('[Classdefinition] A Class', function() {
        it('should can have enumerable properties of all types', function(){

            var properties = {
                  number        : 5
                , string        : 'not empty'
                , bool          : true
                , nil           : null
                , regexp        : /nope/gi
                , date          : new Date(0)
                , err           : new Error('fail')
                , buf           : new Buffer('buffering')
                , fn            : function(){return 42;}
                , obj           : {im:'notEmpty'}
                , arr           : [1,3,3,7]
            };

            var   TestClass = new Class(properties)
                , instance  = new TestClass();

            Object.keys(properties).forEach(function(name){
                assert.equal(instance[name], properties[name]);
            });
        });


        it('should be able to return its __proto__', function() {
            var   Test      = new Class({me: 'michael'})
                , instance  = new Test();

            assert.deepEqual(Class.proto(instance), {me: 'michael'});
        });


        it('should be able to accept property definitions', function() {
            var   Test      = new Class({me: {value: 'michael'}})
                , instance  = new Test();

            assert.deepEqual(instance.me, 'michael');
        });


        it('should respect the configuration of property definers', function() {
            var   Test      = new Class({me: {value: 'michael'}})
                , Test2     = new Class({me: {value: 'michael', enumerable: true}})
                , instance  = new Test()
                , instance2 = new Test2();

            assert.deepEqual(Class.keys(instance), []);
            assert.deepEqual(Class.keys(instance2), ['me']);
        });


        it('should respect the configuration of property definers', function() {
            var   Test      = new Class({me: {value: 'michael'}})
                , Test2     = new Class({me: {value: 'michael', enumerable: true}})
                , instance  = new Test()
                , instance2 = new Test2();

            assert.deepEqual(Class.keys(instance), []);
            assert.deepEqual(Class.keys(instance2), ['me']);
        });


        it('should execute the constructor function', function() {
            var   Test      = new Class({init: function(){ this.name = 'michael'}})
                , instance  = new Test();

            assert.deepEqual(instance, {name: 'michael'});
        });


        it('should accept generated property definers', function() {
            var   Test, instance;

            Test = new Class({
                  default       : Class('default')
                , enumerable    : Class('enumerable').Enumerable()
                , writable      : Class('writable').Writable()
                , configurable  : Class('configurable').Configurable()
                , all           : Class('all').Configurable().Enumerable().Writable()
            })

            instance  = new Test();

            assert.deepEqual(instance, {});
            assert.deepEqual(Class.keys(instance), ['enumerable', 'all']);
        });



        it('should set the correct scope in getters / setters', function(){
            var   Test, instance;

            Test = new Class({
                age: 16
                
                , length: {
                    get: function() {
                        return this.age;
                    }
                }
            })

            instance  = new Test();
            assert.equal(16, instance.length);
        });
    });




    describe('[Inheritance] A Class', function() {
        it('should be able to inherit from another class', function(){
            var   Test      = new Class({init: function(){return 2;}})
                , Test2     = new Class({inherits: Test, init: function init(){ this.number = init.super.call(this);}})
                , instance  = new Test2();

            assert.equal(instance.number, 2);
        });


        it('should be able to inherit from two classes', function(){
            var   Test      = new Class({init: function(){return 2;}})
                , Test2     = new Class({inherits: Test, init: function init(){ return init.super.call(this);}})
                , Test3     = new Class({inherits: Test2, init: function init(){ this.number = init.super.call(this);}})
                , instance  = new Test3();

            assert.equal(instance.number, 2);
        });


        it('should be able to inherit from two classes and skipping prototypes when calling super methods', function(){
            var   Test      = new Class({init: function(){return 2;}})
                , Test2     = new Class({inherits: Test})
                , Test3     = new Class({inherits: Test2, init: function init(){ this.number = init.super.call(this);}})
                , instance  = new Test3();

            assert.equal(instance.number, 2);
        });


        it('should be able to inherit from a native JS type', function(){
            var   Test      = new Class({inherits: Array, toJSON: Class(function(){return Array.prototype.slice.call(this);}), count: {get: function(){return this.length;}}})
                , instance  = new Test();

            instance.push('hi');
            instance.push('my');
            instance.push('name');
            instance.push('is');
            instance.push('michael');

            assert.equal(instance.count, 5);
            assert.deepEqual(instance.toJSON(), ['hi', 'my', 'name', 'is', 'michael']);
        });


        it('should be an instance of its constructor and its prototype constructors', function(){
            var   Test      = new Class({inherits: Array, toJSON: Class(function(){return Array.prototype.slice.call(this);}), count: {get: function(){return this.length;}}})
                , instance  = new Test();

            assert.ok(instance instanceof Test);
            assert.ok(instance instanceof Array);
            assert.ok(instance instanceof Object);
            assert.ok(!(instance instanceof Date));
        });
    });


    

    describe('[Contructor]', function() {
        it('A class should be able to return an object as its instance', function(){
            var Test
                , instance;

            Test = new Class({
                init: function() {
                    return {id: 'obj'};
                }
            });

            instance = new Test();

            assert.equal(instance.id, 'obj');
        });
    });
    


    describe('[Generic Tests]', function() {
        it ('A Class should throw an error when instantiated without the new keyword', function() {
            var a = new Class({init: function(){return 2;}});

            assert.throws(
              function() {
                a();
              }
            );
        });
        

        it('#1 - properties', function(){
           var Person = new Class({
                init: function(options){
                    if (options && options.name !== undefined)  this.name = options.name;
                    if (options && options.age !== undefined)   this.age = options.age;
                }   

                // the private storage for the age value
                , _storage: {
                    value: {
                        age: null
                    }
                }

                , name: '' // enumerable, writable, not configurable

                , age: {
                      get: function(){ return this._storage.age; }
                    , set: function(value) {
                        if (value < 0) throw new Error('Please provide an age >= 0!');
                        else if (value > 150) throw new Error('You are too old to be processed by this system, sorry!');
                        else this._storage.age = value;
                    }
                    , enumerable: true
                    /* , configurable: false */ // defaults to false
                    /* , writable: false */ // defaults to false
                }

                , sayHelloTo: {
                    value: function(name){
                        console.log('Hello %s, my name is %s and im %s years old :)', name, this.name, this.age);
                    }
                }
            });
            
            var instance = new Person({name: 'Michael', age: 30});
    
            // Object keys hets all enumerable keys from the instance but not its prototypes
            assert.equal(Object.keys(instance).length, 1);
            assert.equal(Class.keys(instance).length, 3);
        });


        it('#2 - inheritance', function(){
            var LifeForm = new Class({
                init: function(isAlive) {
                    Class.define(this, 'isAlive', Class(isAlive).Enumerable().Writable());
                }

                , isAlive: Class(false).Enumerable().Writable()
            });


            var Person = new Class({
                inherits: LifeForm

                , talk: function(){
                    console.log('Hi my name is %s, i\'m '+(this.isAlive ? 'alive :)' : 'dead :('), this.name);
                }
            });


            var Boy = new Class({
                inherits: Person

                , init: function constructor(name, alive) {
                    // you need to give the function a name in order to be able to call its super
                    // you must «call» or «apply» the super function to give it the correct context
                    constructor.super.call(this, alive);

                    this.name = Class.define(this, 'name', Class(name).Enumerable());
                }
            });


            var instance = new Boy('Dylan', true);

            assert.equal(instance.isAlive, true);
            assert.equal(instance.name, 'Dylan');

            assert.ok(instance instanceof Boy);
            assert.ok(instance instanceof Person);
            assert.ok(instance instanceof LifeForm);
            assert.ok(instance instanceof Object);
            assert.ok(!(instance instanceof Array));
        });
    });     



    describe('[Static methods]', function() {
        it('The static «Class.proto» method should return the class proto', function(){
           var Person = new Class({
                init: function(options){
                    if (options && options.name !== undefined)  this.name = options.name;
                    if (options && options.age !== undefined)   this.age = options.age;
                }   

                // the private storage for the age value
                , _storage: {
                    value: {
                        age: null
                    }
                }

                , name: '' // enumerable, writable, not configurable

                , age: {
                      get: function(){ return this._storage.age; }
                    , set: function(value) {
                        if (value < 0) throw new Error('Please provide an age >= 0!');
                        else if (value > 150) throw new Error('You are too old to be processed by this system, sorry!');
                        else this._storage.age = value;
                    }
                    , enumerable: true
                    /* , configurable: false */ // defaults to false
                    /* , writable: false */ // defaults to false
                }

                , sayHelloTo: {
                    value: function(name){
                        console.log('Hello %s, my name is %s and im %s years old :)', name, this.name, this.age);
                    }
                }
            });
            
            
            var instance = new Person({name: 'Michael', age: 30});
            assert.equal('{"name":"","age":30}', JSON.stringify(Class.proto(instance)));
        });



        it ('Describe the classes methods', function() {
            var LifeForm = new Class({
                init: function(isAlive) {
                    Class.define(this, 'isAlive', Class(isAlive).Enumerable().Writable());
                }

                , isAlive: Class(false).Enumerable().Writable()

                , die: function(){}
            });


            var Person = new Class({
                inherits: LifeForm

                , talk: function(){
                    console.log('Hi my name is %s, i\'m '+(this.isAlive ? 'alive :)' : 'dead :('), this.name);
                }

                , sing: function() {}
            });


            var Boy = new Class({
                inherits: Person

                , init: function constructor(name, alive) {
                    // you need to give the function a name in order to be able to call its super
                    // you must «call» or «apply» the super function to give it the correct context
                    constructor.super.call(this, alive);

                    this.name = Class.define(this, 'name', Class(name).Enumerable());
                }

                , run: function(){}
                , jump: function(){}
            });



            var instance = new Boy('Dylan', true);
           
          
            /*console.log(JSON.stringify(util.inspect(Class.inspect(instance), {
                depth: 10
            })));*/
        })
    
        
        it('The static «Class.implement» method should implement a class on another object', function(){
            var Person = new Class({
                init: function(options){
                    if (options && options.name !== undefined)  this.name = options.name;
                    if (options && options.age !== undefined)   this.age = options.age;
                }   

                // the private storage for the age value
                , _storage: {
                    value: {
                        age: null
                    }
                }

                , name: '' // enumerable, writable, not configurable

                , age: {
                      get: function(){ return this._storage.age; }
                    , set: function(value) {
                        if (value < 0) throw new Error('Please provide an age >= 0!');
                        else if (value > 150) throw new Error('You are too old to be processed by this system, sorry!');
                        else this._storage.age = value;
                    }
                    , enumerable: true
                    /* , configurable: false */ // defaults to false
                    /* , writable: false */ // defaults to false
                }

                , sayHelloTo: {
                    value: function(name){
                        console.log('Hello %s, my name is %s and im %s years old :)', name, this.name, this.age);
                    }
                }
            });
            
            
            var instance = new Person({name: 'Michael', age: 30})
                , obj = Class.implement(instance, {});

            assert.equal('{"name":"Michael","age":30}', JSON.stringify(obj));
        });
    });     


