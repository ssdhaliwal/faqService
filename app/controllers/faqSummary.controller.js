"use strict";

const SummaryTask = require("../models/faqSummary.model.js");

exports.getSummary = function(request, response) {
  console.log("SC getSummary initialized");

  // internal controller tasks
  SummaryTask.getSummary(request.params, function(error, result) {
    console.log("SC resource", result);

    if (error) {
      return response.status(500).send(JSON.stringify({
        "error": error
      }));
    }

    return response.status(200).send(JSON.stringify({
      "response": result
    }));
  });
};
