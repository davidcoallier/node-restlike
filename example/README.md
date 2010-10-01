Example
=======

Just start the server as such:

 node server.js

The code in server.js should look like:

    var restlike = require('../lib/restlike');

    http.creatServer(function (request, response) {
        var restlike = new restlike.Restlike(request, response);
    
        restlike.match('/my/road', {
            // Handle the GET request
            get: function() { 
                return {"name": "fun"};
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
