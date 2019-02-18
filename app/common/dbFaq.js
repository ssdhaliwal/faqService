"use strict";
var mysql = require("mysql");
var config = require("./config/app.config.js")

//local mysql db connection
var dbFaqPool = mysql.createPool({
  connectionLimit: 50,
  waitForConnections: true,
  queueLimit: 1000,
  multipleStatements: true,
  host: config.database.faq.host,
  user: config.database.faq.user,
  password: config.database.faq.password,
  database: "faq"
});

dbFaqPool.on("acquire", function(connection) {
  console.log("dbFaqPool connection %d acquired", connection.threadId);
});

dbFaqPool.on("connection", function(connection) {
  console.log("dbFaqPool connection %d connected", connection.threadId);
  //connection.query("SET SESSION auto_increment_increment=1")
});

dbFaqPool.on("enqueue", function() {
  console.log("dbFaqPool waiting for available connection slot");
});

dbFaqPool.on("release", function(connection) {
  console.log("dbFaqPool connection %d released", connection.threadId);
});

//dbFaqPool.end(function(err) {
//  console.log("dbFaqPool is closed");
//});

module.exports = dbFaqPool;
