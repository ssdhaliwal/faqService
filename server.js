"use strict";
const config = require('./app/common/config/app.config.js');

var express = require("express"),
  https = require("https"),
  http = require("http"),
  fs = require('fs'),
  app = express(),
  bodyParser = require("body-parser"),
  httpPort = process.env.HTTPPORT || config.httpPort,
  httpsPort = process.env.HTTPSPORT || config.httpsPort;

// body parser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// middlewares - enabling CORS
app.use(function(req, res, next) {
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

// loading the routes
const adminRoutes = require("./app/routes/admin.routes.js");
const faqCategoryRoutes = require("./app/routes/faqCategory.routes.js");
const faqSummaryRoutes = require("./app/routes/faqSummary.routes.js");
const faqTagRoutes = require("./app/routes/faqTag.routes.js");

adminRoutes.routesConfig(app);
faqCategoryRoutes.routesConfig(app);
faqSummaryRoutes.routesConfig(app);
faqTagRoutes.routesConfig(app);

// setting up the http server
var httpServer = http.createServer(app).listen(httpPort, function() {
  let host = httpServer.address().address
  let port = httpServer.address().port
  console.log("Example app listening at http://%s:%s", host, port)
});

// setting up the https server
var httpsOptions = {
    key: fs.readFileSync("certificates/privatekey.pem", "utf8"),
    cert: fs.readFileSync("certificates/certificate.pem", "utf8")
}

var httpsServer = https.createServer(httpsOptions, app).listen(httpsPort, function() {
  let host = httpsServer.address().address
  let port = httpsServer.address().port
  console.log("Example app listening at https://%s:%s", host, port)
});
