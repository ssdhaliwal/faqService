"use strict";
var mysql = require("mysql");

//local mysql db connection
var dbAdminPool = mysql.createPool({
  connectionLimit: 50,
  waitForConnections: true,
  queueLimit: 1000,
  multipleStatements: true,
  host: "localhost",
  user: "admin",
  password: "admin!user",
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
