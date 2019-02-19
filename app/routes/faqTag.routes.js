"use strict";
const config = require("../common/config/app.config.js");

const authMiddleware = require("../middlewares/authorization.middleware.js");
const faqTagService = require("../controllers/faqTag.controller.js");

exports.routesConfig = function(app) {
  app.route("/tag")
    .get([authMiddleware.checkToken,
      authMiddleware.checkPermissionLevel(config.permissionLevels.NORMAL),
      faqTagService.getTag
    ])
    .post([authMiddleware.checkToken,
      authMiddleware.checkPermissionLevel(config.permissionLevels.MANAGER),
      faqTagService.addTag
    ]);
  app.route("/tag/id/:id")
    .get([authMiddleware.checkToken,
      authMiddleware.checkPermissionLevel(config.permissionLevels.NORMAL),
      faqTagService.getTag
    ])
    .delete([authMiddleware.checkToken,
      authMiddleware.checkPermissionLevel(config.permissionLevels.MANAGER),
      faqTagService.deleteTag
    ]);
  app.route("/tag/name/:name")
    .get([authMiddleware.checkToken,
      authMiddleware.checkPermissionLevel(config.permissionLevels.NORMAL),
      faqTagService.getTag
    ])
    .delete([authMiddleware.checkToken,
      authMiddleware.checkPermissionLevel(config.permissionLevels.MANAGER),
      faqTagService.deleteTag
    ]);
  app.route("/tag/rename")
    .post([authMiddleware.checkToken,
      authMiddleware.checkPermissionLevel(config.permissionLevels.MANAGER),
      faqTagService.renameTag
    ]);
};
