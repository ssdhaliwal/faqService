"use strict";
const faqCategoryService = require("../controllers/faqCategory.controller.js");

exports.routesConfig = function(app) {
  app.route("/category")
    .get(faqCategoryService.getCategory)
    .post(faqCategoryService.addCategory);
  app.route("/category/id/:id")
    .get(faqCategoryService.getCategory)
    .delete(faqCategoryService.deleteCategory);
  app.route("/category/name/:name")
    .get(faqCategoryService.getCategory)
    .delete(faqCategoryService.deleteCategory);
  app.route("/category/rename")
    .post(faqCategoryService.renameCategory);
};
