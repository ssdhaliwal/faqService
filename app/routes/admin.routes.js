"use strict";
const authMiddleware = require("../middlewares/authorization.middleware.js");
const adminService = require("../controllers/admin.controller.js");

exports.routesConfig = function(app) {

  app.route("/login")
    .post(adminService.doLogin);
  app.route("/login/valid")
    .get(adminService.doTokenCheck);

  app.route("/admin/users")
    .get([authMiddleware.checkToken,
      authMiddleware.checkPermissionLevel(10),
      adminService.getUser
    ])
    .post(adminService.addUser);
  app.route("/admin/users/id/:id")
    .get(adminService.getUser)
    .delete(adminService.deleteUser);
  app.route("/admin/users/:firstName/:lastName")
    .get(adminService.getUser)
    .delete(adminService.deleteUser);
};
