"use strict";
var mysql = require("mysql");
var config = require("./config/app.config.js")

//local mysql db connection
var dbAdminPool = mysql.createPool({
  connectionLimit: 50,
  waitForConnections: true,
  queueLimit: 1000,
  multipleStatements: true,
  host: config.database.admin.host,
  user: config.database.admin.user,
  password: config.database.admin.password,
  database: "admin"
});

dbAdminPool.on("acquire", function(connection) {
  console.log("dbAdminPool connection %d acquired", connection.threadId);
});

dbAdminPool.on("connection", function(connection) {
  console.log("dbAdminPool connection %d connected", connection.threadId);
  //connection.query("SET SESSION auto_increment_increment=1")
});

dbAdminPool.on("enqueue", function() {
  console.log("dbAdminPool waiting for available connection slot");
});

dbAdminPool.on("release", function(connection) {
  console.log("dbAdminPool connection %d released", connection.threadId);
});

//dbAdminPool.end(function(err) {
//  console.log("dbAdminPool is closed");
//});

module.exports = dbAdminPool;
