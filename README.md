node.js RESTlike
==================

> Very very experimental node.js REST-ish-like server.

introduction
------------

The goal of restlike is to provide a simple quick way to test out the abilitites of node.js. I've done this only to test out
a few new things and execute benchmarks against node.js and other languages. 

If you feel like fixing it, forking it, breaking it, etc. then knock yourself out.

If you are looking for something solid, look at journey and/or nodejitsu, they have a bunch of awesomesauce things.

synopsis
--------

    var restlike = require('./lib/restlike');

    http.createServer(function (request, response) {
        var restlike = new restlike.Restlike(request, response);
    
        restlike.match('/my/:name', {
            // Handle the GET request
            get: function(data) { 
                return {"name": data.name};
            },
            
            // Handle the POST request
            post: function() {
                return ['posted'];
            }
        });
    
        restlike.match('/your/road',{
            // Handle the DELETE request.
            delete: function() {
                return [1,2,3,4,5];
            }
        });
    }).listen(8080);


license
-------

Released under the New BSD License.

Copyright (c) 2010 David Coallier


disclaimer
----------
It probably is broken.
