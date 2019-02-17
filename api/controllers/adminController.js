"use strict";

var crypto = require("crypto");
var AdminTask = require("../models/adminModel.js");

exports.getUser = function(request, response) {
  console.log("Admin getUser initialized");

  // internal controller tasks
  AdminTask.getUser(request.params, function(error, result) {
    console.log("Admin resource", result);

    if (error) {
      response.send(JSON.stringify({"status": 500, "error": error, "response": null}));
    }

    response.send(JSON.stringify({"status": 200, "error": null, "response": result}));
  });
};

exports.addUser = function(request, response) {
  console.log("Admin addUser initialized");

  // validate passed params
  if (!request.body.firstName) {
    response.send(JSON.stringify({"status": 500, "error": "invalid firstName", "response": null}));
    return;
  }
  if (!request.body.lastName) {
    response.send(JSON.stringify({"status": 500, "error": "invalid lastName", "response": null}));
    return;
  }
  if (!request.body.email) {
    response.send(JSON.stringify({"status": 500, "error": "invalid email", "response": null}));
    return;
  }
  if (!request.body.password) {
    response.send(JSON.stringify({"status": 500, "error": "invalid password", "response": null}));
    return;
  }
  request.body.permissionLevel = request.body.permissionLevel || 1

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
      response.send(JSON.stringify({"status": 500, "error": error, "response": null}));
    }

    response.send(JSON.stringify({"status": 200, "error": null, "response": result}));
  });
};

exports.deleteUser = function(request, response) {
  console.log("Admin deleteUser initialized");

  // internal controller tasks
  AdminTask.deleteUser(request.params, function(error, result) {
    console.log("Admin resource", result);

    if (error) {
      response.send(JSON.stringify({"status": 500, "error": error, "response": null}));
    }

    response.send(JSON.stringify({"status": 200, "error": null, "response": result}));
  });
};
