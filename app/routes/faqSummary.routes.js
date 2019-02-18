"use strict";
const faqSummaryService = require("../controllers/faqSummary.controller.js");

exports.routesConfig = function(app) {
  app.route("/summary")
    .get(faqSummaryService.getSummary);
};
