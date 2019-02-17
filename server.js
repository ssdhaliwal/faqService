var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  port = process.env.PORT || 3080;

// body parser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// enabling CORS
app.use(function(req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
  next();
});

// setting up the server
var server = app.listen(port, function() {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})

// loading the routes
var routes = require("./api/routes/appRoutes");
routes(app);
