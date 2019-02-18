"use strict";

const crypto = require("crypto");
const AdminTask = require("../models/admin.model.js");

exports.getUser = function(request, response) {
  console.log("Admin getUser initialized");

  // internal controller tasks
  AdminTask.getUser(request.params, function(error, result) {
    console.log("Admin resource", result);

    if (error) {
      response.status(500).send(JSON.stringify({
        "error": error
      }));
    }

    response.status(200).send(JSON.stringify({
      "response": result
    }));
  });
};

exports.addUser = function(request, response) {
  console.log("Admin addUser initialized");

  // validate passed params
  if (!request.body.firstName) {
    response.status(500).send(JSON.stringify({
      "error": "invalid firstName"
    }));
    return;
  }
  if (!request.body.lastName) {
    response.status(500).send(JSON.stringify({
      "error": "invalid lastName"
    }));
    return;
  }
  if (!request.body.email) {
    response.status(500).send(JSON.stringify({
      "error": "invalid email"
    }));
    return;
  }
  if (!request.body.password) {
    response.status(500).send(JSON.stringify({
      "error": "invalid password"
    }));
    return;
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
      response.status(500).send(JSON.stringify({
        "error": error
      }));
    }

    response.status(200).send(JSON.stringify({
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
      response.status(500).send(JSON.stringify({
        "error": error
      }));
    }

    response.status(200).send(JSON.stringify({
      "response": result
    }));
  });
};
