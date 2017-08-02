# async-method

Makes async methods work with callbacks and promises. You have a function on your class that expects a callback as last parameter? Wrap it using the asyncMethod and it returns a promise if the callback is omitted.

## installation

    npm i async-method

## build status

[![Build Status](https://travis-ci.org/eventEmitter/async-method.png?branch=master)](https://travis-ci.org/eventEmitter/async-method)


## usage
    
    // create a class 
    var MyClass = new Class({
        multiply: asyncMethod(function(a, b, callback) {
            process.nextTick(function() {
                callback(null, a*b);
            });
        })
    });



    var myClassInstance = new MyClass();


    // classic callback 
    myClassInstance.multiply(3, 5, function(err, result) {

    });


    // es6 promise
    myClassInstance.multiply(3, 5).then(function(result) {

    }).catch(function(err) {

    });
