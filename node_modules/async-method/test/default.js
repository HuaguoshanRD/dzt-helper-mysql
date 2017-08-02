
	
	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, assert 		= require('assert');



	var asyncMethod = require('../')


	var MyClass = new Class({

	    exec: asyncMethod(function(a, b, callback) {
			process.nextTick(function() {
				callback(null, a*b);
			});
		})
	});



	describe('Async Methods', function(){
		it('should work with callbacks', function(done) {
			new MyClass().exec(4, 5, function(err, result) {
				assert.equal(result, 20);
				done();
			});
		});

		it('should work with promises', function(done) {
			new MyClass().exec(4, 5).then(function(result) {
				assert.equal(result, 20);
				done();
			}).catch(done);
		});	
	});
	