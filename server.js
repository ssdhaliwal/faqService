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

// setting up the server
var server = app.listen(port, function() {
  let host = server.address().address
  let port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
});
