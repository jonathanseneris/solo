/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var messageArray = [];
// module.exports.handleRequest = requestHandler;

module.exports = function(request, response) {
  // Request and Response come from node's http module.

  console.log("start");

  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);

  // The outgoing status.

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = "application/json";

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  response.url = 'classes/messages/';

  var statusCode = 200;
  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.

  var returnObject = {
    results: []
  };

  if (request.method === "GET") {
    console.log("URL:", request.url);
    if (request.url === "/classes/messages" || request.url === "/classes/room1") {
      var stringifiedArray = JSON.stringify(messageArray);
      returnObject.results = messageArray;
    } else {
      statusCode = 404;
      response.writeHead(statusCode, headers);
      // console.log(request);
      response.end();
    }

  } else if (request.method === "POST") {
    console.log("POST");
    statusCode = 201;
    var requestBody = '';
    var newMessage = '';
    request.on('data', function(chunk) {
      newMessage += chunk;
    });
    request.on('end', function() {
      newMessage = JSON.parse(newMessage);
      messageArray.push(newMessage);
    });
  } else if (request.method === "OPTIONS") {
    console.log("options received");

    // headers["Allow"] = "GET, POST, PUT, DELETE, OPTIONS";
    // var test = JSON.parse(request);
    // for (key in request) {
    //   console.log(key);
    // }
    // console.log(request.client);

    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(returnObject)); //

  }

  response.writeHead(statusCode, headers);

  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

  response.end(JSON.stringify(returnObject));
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
