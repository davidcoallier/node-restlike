var sys = require('sys');
var http = require('http');
var restlike = require('./lib/restlike');

http.createServer(function (request, response) {
    var rest = new restlike.Restlike(request, response);
    rest.match('/time/to/go', {
        get: function() {
            return [1,2,3];
        }
    });

    rest.match('/github/rocks', {
        get: function() {
            var names = ["david", "github", "nodejs"];
            return names;
        }
    });

    response.writeHead(404, {"Content-Type": "text/plain"});
    response.end('Not found.');
}).listen(8811);

sys.puts('REST-like is running on port http://127.0.0.1:8811');
