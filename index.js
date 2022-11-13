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
    //choose the handler this request should go to not found handler
    let chooseHandler;
    if (trimmedPath == "sample") {
      chooseHandler = router[trimmedPath];
    } else {
      chooseHandler = router["notFound"];
    }
    const data = {
      trimmedPath,
      method,
      headers,
      payload: buffer,
    };
    chooseHandler(data, function (statusCode, payload) {
      statusCode = typeof statusCode == "number" && 200;
      //payload
      payload = typeof payload == "object" ? payload : "hiii";
      const payloadString=JSON.stringify(payload);
      //return the response
      res.writeHead(statusCode);
      console.log(statusCode, payload, "buffer__Text");
      res.end(payloadString);
    });

    //route the request to the handler to matching the
    console.log(chooseHandler);
  });
});

server.listen(3000, function () {
  console.log("the server is listening");
});

//define handlers
let handlers = {};
//sample Handler
handlers.sample = function (data, callback) {
  callback(406, { name: "myname is sample handler" });
};
//not found handler
handlers.notFound = function (data, callback) {
  //callback http status code and payload object
  callback(404, { name: "not found sorry" });
};

//define a router
let router = {
  sample: handlers.sample,
  notFound: handlers.notFound,
};
