"use strict";
const adminService = require("../controllers/admin.controller.js");

exports.routesConfig = function(app) {
  /*
  app.route("/login")
    .post(userService.doLogin);
  app.route("/logout")
    .post(userService.doLogout);
  */
  app.route("/admin/users")
    .get(adminService.getUser)
    .post(adminService.addUser);
  app.route("/admin/users/id/:id")
    .get(adminService.getUser)
    .delete(adminService.deleteUser);
  app.route("/admin/users/:firstName/:lastName")
    .get(adminService.getUser)
    .delete(adminService.deleteUser);
};
