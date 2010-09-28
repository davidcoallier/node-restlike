/**
 * Very experimental node.js-rest-like server. Nothing fancy. Only did that to execute
 * some benchmarks and conduct research on general performances.
 *
 * Feel free to play with it, break it, toss it, whine about it and destroy it :)
 *
 * Author: David Coallier <david.coallier@gmail.com>
 * License: New BSD <http://www.opensource.org/licenses/bsd-license.php>
 * Date: 28th September, 2010
 */
var url = require('url');

/**
 * The router that matches routes
 */
var Router = function(){};
Router.prototype.match = function (activeRoute, expectedRoute) {
    if (activeRoute == expectedRoute) {
        return true;
    }
    
    return false;
};

/**
 * This is where the content negotiation and what kind of 
 * response is returned to the users
 * @param {Object} An object of the HTTP Request from require('http') containing
 *                 the request information.
 *
 * @param {Object} An object of the HTTP Request from require('http') containing
 *                 the response object will contain.
 */
var Content = function(request, response) {
    this.data         = false;
    this.request      = request;
    this.response     = response;
    this.contentTypes = {
        "application/json": "json",
        "text/plain"      : "plain",
        "text/json"       : "json"
    };
    
    this.contentType = "json";
};

/**
 * The JSON content response.
 */
Content.prototype.json = function() {
    var retValue = {
        headers: {
            'Content-Type': 'application/json'
        },
        statusCode: 200,
        data: {},
    };
    
    retValue.data = JSON.stringify(this.data);
    return retValue;
};

/**
 * The plain text content response.
 */
Content.prototype.plain = function() {
    var retValue = {
        headers: {
            'Content-Type': 'text/plain'
        },
        
        statusCode: 200,
        data: {},
    };
    
    retValue.data = this.data.toString();
    return retValue;        
};

/**
 * Content negotiation is done here. We identify the type
 * of "Accept" headers and handle the response type.
 *
 * @param {Mixed} Either a string, an array of information, an object
 *                or anything that could be returned to the clients after
 *                negotiation of the content.
 * @param {Object} An array of headers from the http request. 
 *
 * @return {Object} An array of information as such as headers, responseCode and data
 *                  that will be returned to the clients.
 */
Content.prototype.negotiate = function(data, headers) {
    this.data    = data || {};
    this.headers = headers || {};

    if (this.request.headers.accept == undefined) {
        this.request.headers.accept = 'application/json';
    }

    if (this.contentTypes[this.request.headers.accept] == undefined) {
        this.request.headers.accept = 'application/json';
    }
    
    var contentType = this.contentTypes[this.request.headers.accept];

    var ret = eval('this.' + contentType + '()');
    return ret;
};

/**
 * Main framework object. This is where we instantiate
 * the rest-like object using the http.request and http.response
 * variables
 * @param {Object} An object of the HTTP Request from require('http') containing
 *                 the request information.
 *
 * @param {Object} An object of the HTTP Request from require('http') containing
 *                 the response object will contain.
 */
var Restlike = function(request, response) {
    this.response = response;
    this.request = request;
};

/**
 * Rest-like match routes and execute callbacks to the good closure
 * method that handles the correct http method.
 *
 * If the no route is matched, we return a 404 with a Not Found. message in the
 * body as text/plain.
 *
 * <code>
 * var restlike = require('restlike');
 * http.createServer(function (request, response) {
 *    var rest = new restlike.Restlike();
 *    rest.match('/route/to/path', {
 *        'get' => function() {
 *            return [1,2,3,4,5];
 *        }
 *    });
 * }).listen(8080);
 * </code>
 *
 * @param {String} The route being accessed
 * @param {Anon} An anonymous object containing the HTTP calls to the module.
 */
Restlike.prototype.match = function(route, callback) {
    var router  = new Router();
    var content = new Content(this.request, this.response);

    var response = {};
    var httpMethod = this.request.method.toLowerCase();

    if (router.match(route, this.request.url)) {
        var caller = eval('callback.'+httpMethod);
        response = content.negotiate(caller(url.parse(this.request.url, true).query));
        if (response.headers) {
            this.response.writeHead(response.statusCode, response.headers);
        }
        this.response.end(response.data);        
    }
    
    return true;
};

// The node.js exports
exports.Restlike = Restlike;