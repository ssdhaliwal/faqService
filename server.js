const config = require('./app/common/config/app.config.js');

var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  port = process.env.PORT || config.port;

// body parser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// enabling CORS
app.use(function(req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');

  if (req.method === 'OPTIONS') {
      return res.send(200);
  } else {
      return next();
  }
});

// setting up the server
var server = app.listen(port, function() {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})

// loading the routes
var routes = require("./app/routes/appRoutes");
routes(app);
