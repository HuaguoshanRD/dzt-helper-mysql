


    var   Eventemitter  = require('../')
        , util          = require('util')
        , assert        = require('assert');



    describe('An instance of an EventEmitter', function() {
        it('should be able to emit events (mutliple times)', function(){
            var   instance  = new Eventemitter()
                , counter   = 0;

            instance.on('load', function(){counter++;});
            instance.emit('load');
            instance.emit('load');

            assert.equal(counter, 2);
        });


        it('should be able to emit events once', function() {
            var   instance  = new Eventemitter()
                , counter   = 0;

            instance.once('load', function(){counter++;});
            instance.emit('load');
            instance.emit('load');

            assert.equal(counter, 1);
        });

        it('should not share across instances', function() {
            var   instance  = new Eventemitter()
                , instance2 = new Eventemitter()
                , counter   = 0;

            instance.on('load', function(){counter++;});
            instance.emit('load');
            instance2.emit('load');

            assert.equal(counter, 1);
        });
    });
