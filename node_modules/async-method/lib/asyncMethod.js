!function() {

    var   type      = require('ee-types')
        , Promise   = (Promise || require('es6-promise').Promise);



	module.exports = function(method) {
        return function() {
            
            // create an array out of the arguments object
            var args = Array.prototype.slice.call(arguments);


            // if the last argument is a function, we're working with callbacks
            if (type.function(args[args.length -1])) {
                method.apply(this, args);
            }
            else {
                return new Promise(function(resolve, reject) {
                    args.push(function(err, arg) {
                        if (err) reject(err);
                        else resolve(arg);
                    });

                    method.apply(this, args);
                }.bind(this));
            }
        }
    }
}();
