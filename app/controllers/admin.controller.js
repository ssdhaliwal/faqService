"use strict";

const config = require('../common/config/app.config.js');

const crypto = require("crypto");
const jwt = require('jsonwebtoken');

const AdminTask = require("../models/admin.model.js");

exports.doLogin = function(request, response) {
  console.log("Admin doLogin initialized");

  // validate passed params
  if (!request.body.email) {
    return response.status(500).send(JSON.stringify({
      "error": "invalid email"
    }));
  }
  if (!request.body.password) {
    return response.status(500).send(JSON.stringify({
      "error": "invalid password"
    }));
  }

  // internal controller tasks
  AdminTask.getUser(request.body, function(error, result) {
    console.log("Admin resource", result);

    if (error) {
      return response.status(500).send(JSON.stringify({
        "error": error
      }));
    }

    // verify user
    let rowArray = Object.values(JSON.parse(JSON.stringify(result)));
    if (rowArray.length > 0) {
      let passwordFields = rowArray[0].password.split("$");
      let salt = passwordFields[0];
      let hash = crypto.createHmac('sha512', salt).update(request.body.password).digest("base64");

      if (hash === passwordFields[1]) {
        request.body = {
          firstName: rowArray[0].firstName,
          lastName: rowArray[0].lastName,
          email: rowArray[0].email,
          permissionLevel: rowArray[0].permissionLevel,
          clientIP: request.headers['x-forwarded-for'] ||
            request.connection.remoteAddress ||
            request.socket.remoteAddress ||
            (request.connection.socket ? request.connection.socket.remoteAddress : null)
        };

        // generate and attach jwt token
        let token = jwt.sign(request.body, config.jwt_secret, {
          expiresIn: config.jwt_expiration_in_seconds
        });

        console.log(request.body);
        return response.status(200).send(JSON.stringify({
          "response": {
            "auth": true,
            "message": {
              "token": token
            }
          }
        }));
      } else {
        console.log(request.body);
        return response.status(401).send(JSON.stringify({
          "response": {
            "auth": false,
            "message": "invalid password!"
          }
        }));
      }
    } else {
      return response.status(401).send(JSON.stringify({
        "response": {
          "auth": false,
          "message": "no matching record!"
        }
      }));
    }
  });
};

exports.doTokenCheck = function(request, response) {
  console.log("Admin doTokenCheck initialized");

  // check if params were provided
  let token = request.headers["x-access-token"];
  if (!token) {
    return result(null, {
      "auth": false,
      "message": "no token provided!"
    });
  }

  // decode the token
  jwt.verify(token, config.jwt_secret, function(error, decoded) {
    // if error, exit
    if (error) {
      return response.status(401).send(JSON.stringify({
        "auth": false,
        "message": error
      }));
    }

    // ensure the ip is same as token
    console.log(decoded);
    let clientIP = request.headers['x-forwarded-for'] ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      (request.connection.socket ? request.connection.socket.remoteAddress : null);

    if (decoded.clientIP !== clientIP) {
      response.status(424).send(JSON.stringify({
        "error": "token does not match origin!"
      }));
    }

    // internal controller tasks
    AdminTask.getUser(decoded, function(error, result) {
      console.log("Admin resource", result);

      if (error) {
        response.status(500).send(JSON.stringify({
          "error": error
        }));
      }

      // verify user
      let rowArray = Object.values(JSON.parse(JSON.stringify(result)));
      if (rowArray.length > 0) {
        return response.status(200).send(JSON.stringify({
          "response": {
            "auth": true,
            "message": {
              "token": token
            }
          }
        }));
      } else {
        return response.status(401).send(JSON.stringify({
          "response": {
            "auth": false,
            "message": "no matching record!"
          }
        }));
      }
    });
  });
};

exports.getUser = function(request, response) {
  console.log("Admin getUser initialized");

  // internal controller tasks
  AdminTask.getUser(request.params, function(error, result) {
    console.log("Admin resource", result);

    if (error) {
      return response.status(500).send(JSON.stringify({
        "error": error
      }));
    }

    return response.status(200).send(JSON.stringify({
      "response": result
    }));
  });
};

exports.addUser = function(request, response) {
  console.log("Admin addUser initialized");

  // validate passed params
  if (!request.body.firstName) {
    return response.status(500).send(JSON.stringify({
      "error": "invalid firstName"
    }));
  }
  if (!request.body.lastName) {
    return response.status(500).send(JSON.stringify({
      "error": "invalid lastName"
    }));
  }
  if (!request.body.email) {
    return response.status(500).send(JSON.stringify({
      "error": "invalid email"
    }));
  }
  if (!request.body.password) {
    return response.status(500).send(JSON.stringify({
      "error": "invalid password"
    }));
  }
  request.body.permissionLevel = request.body.permissionLevel || 1;

  // fix the user password to be encrypted
  let salt = crypto.randomBytes(16).toString("base64");
  let hash = crypto.createHmac("sha512", salt)
    .update(request.body.password)
    .digest("base64");
  request.body.password = salt + "$" + hash;

  // create params to pass to addUser
  let params = [];
  params.push(request.body.firstName);
  params.push(request.body.lastName);
  params.push(request.body.email);
  params.push(request.body.password);
  params.push(request.body.permissionLevel || 1);

  // internal controller tasks
  AdminTask.addUser(params, function(error, result) {
    console.log("Admin resource", result);

    if (error) {
      return response.status(500).send(JSON.stringify({
        "error": error
      }));
    }

    return response.status(200).send(JSON.stringify({
      "response": result
    }));
  });
};

exports.deleteUser = function(request, response) {
  console.log("Admin deleteUser initialized");

  // internal controller tasks
  AdminTask.deleteUser(request.params, function(error, result) {
    console.log("Admin resource", result);

    if (error) {
      return response.status(500).send(JSON.stringify({
        "error": error
      }));
    }

    return response.status(200).send(JSON.stringify({
      "response": result
    }));
  });
};
