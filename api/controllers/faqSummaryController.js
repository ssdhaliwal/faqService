"use strict";

var SummaryTask = require("../models/faqSummaryModel.js");

exports.getSummary = function(request, response) {
  console.log("SC getSummary initialized");

  // internal controller tasks
  SummaryTask.getSummary(request.params, function(error, result) {
    console.log("SC resource", result);

    if (error) {
      response.send(JSON.stringify({"status": 500, "error": error, "response": null}));
    }

    response.send(JSON.stringify({"status": 200, "error": null, "response": result}));
  });
};
