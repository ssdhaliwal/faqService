"use strict";
const faqTagService = require("../controllers/faqTag.controller.js");

exports.routesConfig = function(app) {
  app.route("/tag")
    .get(faqTagService.getTag)
    .post(faqTagService.addTag);
  app.route("/tag/id/:id")
    .get(faqTagService.getTag)
    .delete(faqTagService.deleteTag);
  app.route("/tag/name/:name")
    .get(faqTagService.getTag)
    .delete(faqTagService.deleteTag);
  app.route("/tag/rename")
    .post(faqTagService.renameTag);
};
