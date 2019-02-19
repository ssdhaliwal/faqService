"use strict";
const config = require("../common/config/app.config.js");

const authMiddleware = require("../middlewares/authorization.middleware.js");
const faqCategoryService = require("../controllers/faqCategory.controller.js");

exports.routesConfig = function(app) {
  app.route("/category")
    .get([authMiddleware.checkToken,
      authMiddleware.checkPermissionLevel(config.permissionLevels.NORMAL),
      faqCategoryService.getCategory
    ])
    .post([authMiddleware.checkToken,
      authMiddleware.checkPermissionLevel(config.permissionLevels.MANAGER),
      faqCategoryService.addCategory
    ]);
  app.route("/category/id/:id")
    .get([authMiddleware.checkToken,
      authMiddleware.checkPermissionLevel(config.permissionLevels.NORMAL),
      faqCategoryService.getCategory
    ])
    .delete([authMiddleware.checkToken,
      authMiddleware.checkPermissionLevel(config.permissionLevels.MANAGER),
      faqCategoryService.deleteCategory
    ]);
  app.route("/category/name/:name")
    .get([authMiddleware.checkToken,
      authMiddleware.checkPermissionLevel(config.permissionLevels.NORMAL),
      faqCategoryService.getCategory
    ])
    .delete([authMiddleware.checkToken,
      authMiddleware.checkPermissionLevel(config.permissionLevels.MANAGER),
      faqCategoryService.deleteCategory
    ]);
  app.route("/category/rename")
    .post([authMiddleware.checkToken,
      authMiddleware.checkPermissionLevel(config.permissionLevels.MANAGER),
      faqCategoryService.renameCategory
    ]);
};
