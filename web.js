var fs = require('fs');
var express = require('express');

var app = express.createServer(express.logger());

var buffer = fs.readFileSync('index.html');
var decode_str = buffer.toString();

app.get('/', function(request, response) {
  response.send(decode_str);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
