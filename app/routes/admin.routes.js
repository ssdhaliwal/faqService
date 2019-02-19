"use strict";
const config = require("../common/config/app.config.js");

const authMiddleware = require("../middlewares/authorization.middleware.js");const adminService = require("../controllers/admin.controller.js");

exports.routesConfig = function(app) {

  app.route("/login")
    .post(adminService.doLogin);
  app.route("/login/valid")
    .get(adminService.doTokenCheck);

  app.route("/admin/users")
    .get([authMiddleware.checkToken,
      authMiddleware.checkPermissionLevel(config.permissionLevels.SUPER),
      adminService.getUser
    ])
    .post([authMiddleware.checkToken,
      authMiddleware.checkPermissionLevel(config.permissionLevels.SUPER),
      adminService.addUser
    ]);
  app.route("/admin/users/id/:id")
    .get([authMiddleware.checkToken,
      authMiddleware.checkPermissionLevel(config.permissionLevels.SUPER),
      adminService.getUser
    ])
    .delete([authMiddleware.checkToken,
      authMiddleware.checkPermissionLevel(config.permissionLevels.SUPER),
      adminService.deleteUser
    ]);
  app.route("/admin/users/:firstName/:lastName")
    .get([authMiddleware.checkToken,
      authMiddleware.checkPermissionLevel(config.permissionLevels.SUPER),
      adminService.getUser
    ])
    .delete([authMiddleware.checkToken,
      authMiddleware.checkPermissionLevel(config.permissionLevels.SUPER),
      adminService.deleteUser
    ]);
};
