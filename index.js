//starting a server
const http = require("http");
//const StringDecoder = require("string_decoder");
const url = require("url");
const { StringDecoder } = require("node:string_decoder");
const server = http.createServer(function (req, res) {
  //get the url
  const parsedUrl = url.parse(req.url, true);
  //get the path from the url
  const path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");
  //then send the response
  //get the method from the user
  const method = req.method.toLowerCase();
  //get the query string as objecy
  const queryString = parsedUrl.query;
  //get the headers and object
  const headers = req.headers;
  //console.log("headers_____", headers);
  //get the payload
  const decoder = new StringDecoder("utf-8");
  let buffer = "";
  req.on("data", function (data) {
    buffer += decoder.write(data);
  });
  req.on("end", function () {
    buffer += decoder.end();
    res.end("Hello world\n");
    console.log("payload_____", buffer);
  });
  //choose the handler this request should go
  let chooseHandler =
    typeof router[trimmedPath] !== undefined
      ? router[trimmedPath]
      : handlers.notFound;

  //contruct the data object to send to the handler
  let data = {
    trimmedPath: trimmedPath,
    queryStringObject: queryString,
    method: method,
    headers: headers,
    payload: buffer,
  };

  //route the request to the handler into the router
  chooseHandler(data, function (statusCode, payload) {
    //use the status code called back by the handler default 200
    statusCode = typeof statusCode == "number" ? statusCode : 200;
    //use the payload callback back by the handler
    payload = typeof payload == "object" ? payload : {};
    //convert the payload into string
    let payloadString = JSON.stringify(payload);
    //return the response
    res.writeHead(statusCode);
    res.end(payloadString);

    //console
    console.log("Returning this response", statusCode.payloadString);
  });
});

server.listen(3000, function () {
  console.log("the server is listening");
});

//define handlers
let handlers = {};
//sample handler
handlers.sample = function (data, callback) {
  //callback http status code & payload =="object"
  callback(406, { name: "sample handler" });
};

//not found handler
handlers.notFound = function (data, callback) {
  callback(404);
};

//define a request router
var router = {
  sample: handlers.sample,
};
