"user strict";
var dbFaqPool = require("../common/dbFaq.js");

//Category object constructor
var Summary = function(summary) {
  this.summary = summary.summary;
  this.status = summary.status;
  this.created_at = new Date();
};

Summary.getSummary = function getSummary(params, result) {
  dbFaqPool.getConnection(function(error, connection) {
    if (error) {
      console.log("dbPool getSummary connection error", error);
      throw error;
    }

    // execute the query and return the resutl
    connection.query("SELECT categoryCount, tagCount, contentCount from vw_faq_summary",
      function(error, answer) {
        connection.release();

        if (error) {
          console.log("SC/M getSummary error", error);
          result(null, error);
        } else {
          console.log("SC/M getSummary task", answer);
          result(null, answer);
        }
      });
  });
};

module.exports = Summary;
