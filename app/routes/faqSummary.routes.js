"use strict";
const config = require("../common/config/app.config.js");

const authMiddleware = require("../middlewares/authorization.middleware.js");
const faqSummaryService = require("../controllers/faqSummary.controller.js");

exports.routesConfig = function(app) {
  app.route("/summary")
    .get([authMiddleware.checkToken,
      authMiddleware.checkPermissionLevel(config.permissionLevels.NORMAL),
      faqSummaryService.getSummary
    ]);
};
