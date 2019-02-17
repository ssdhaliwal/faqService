"use strict";

module.exports = function(app) {
  var adminService = require("../controllers/adminController.js");
  var faqSummaryService = require("../controllers/faqSummaryController.js");
  var faqCategoryService = require("../controllers/faqCategoryController.js");
  var faqTagService = require("../controllers/faqTagController.js");

  app.route("/admin/users")
    .get(adminService.getUser)
    .post(adminService.addUser);
  app.route("/admin/users/id/:id")
    .get(adminService.getUser)
    .delete(adminService.deleteUser);
  app.route("/admin/users/:firstName/:lastName")
    .get(adminService.getUser)
    .delete(adminService.deleteUser);

  app.route("/summary")
    .get(faqSummaryService.getSummary);

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
