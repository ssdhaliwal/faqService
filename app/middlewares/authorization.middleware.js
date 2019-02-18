"use strict";

const config = require('../common/config/app.config.js');

const crypto = require("crypto");
const jwt = require('jsonwebtoken');

exports.checkToken = function(request, response, next) {
  console.log("MW/checkToken initialized");

  // check if params were provided
  let token = request.headers["x-access-token"];
  if (!token) {
    return response.status(401).send(JSON.stringify({
      "auth": false,
      "message": "no token provided!"
    }));
  }

  // decode the token
  jwt.verify(token, config.jwt_secret, function(error, decoded) {
    // if error, exit
    if (error) {
      return response.status(401).send(JSON.stringify({
        "auth": false,
        "message": "token cannot be verified!"
      }));
    }

    // check if user exists in the database, if not return error
    // return authorized
    request.locals = {};
    request.locals.JWT = decoded;

    return next();
  });
};

exports.checkPermissionLevel = function(minimumLevel) {
  return function(request, response, next) {
    console.log("MW/checkPermissionLevel initialized");

    console.log(request.locals.JWT, minimumLevel);
    if (request.locals.JWT.permissionLevel < minimumLevel) {
      return response.status(401).send(JSON.stringify({
        "auth": false,
        "message": "user not authorized!"
      }));
    }

    return next();
  };
};
