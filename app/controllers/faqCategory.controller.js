"use strict";

const CategoryTask = require("../models/faqCategory.model.js");

exports.getCategory = function(request, response) {
  console.log("CC getCategory initialized");

  // internal controller tasks
  CategoryTask.getCategory(request.params, function(error, result) {
    console.log("CC getCategory resource", result);

    if (error) {
      response.status(500).send(JSON.stringify({
        "status": 500,
        "error": error,
        "response": null
      }));
    }

    response.status(200).send(JSON.stringify({
      "status": 200,
      "error": null,
      "response": result
    }));
  });
};

exports.addCategory = function(request, response) {
  console.log("CC addCategory initialized");

  // internal controller tasks
  if (request.body && Array.isArray(request.body)) {
    let results = [];
    let resultCount = request.body.length;

    // [{"category":"value1"},{"category":"value2"},{"category":"value3"},{"category":"value4"},{"category":"value5"},{"category":"value6"}]
    request.body.forEach(function(category, index) {
      CategoryTask.addCategory([category], function(error, result) {
        console.log("CC addCategory resource", result);

        if (error) {
          response.status(500).send(JSON.stringify({
            "error": error
          }));
        }

        // store the result
        results.push(JSON.parse(JSON.stringify(result)));
        resultCount--;

        // return consolidated result
        if (resultCount === 0) {
          response.status(200).send(JSON.stringify({
            "response": results
          }));
        }
      });
    });
  }
};

exports.renameCategory = function(request, response) {
  console.log("CC renameCategory initialized");

  // internal controller tasks
  if (request.body && Array.isArray(request.body)) {
    let results = [];
    let resultCount = request.body.length;

    // [{"category":"value1", "renameTo":"value12"},{"category":"value2", "renameTo":"value22"},{"category":"value3", "renameTo":"value32"},{"category":"value4", "renameTo":"value42"},{"category":"value5", "renameTo":"value52"},{"category":"value6", "renameTo":"value62"}]
    request.body.forEach(function(item, index) {
      CategoryTask.renameCategory([item.category, item.renameTo], function(error, result) {
        console.log("CC renameCategory resource", result);

        if (error) {
          response.status(500).send(JSON.stringify({
            "error": error
          }));
        }

        // store the result
        results.push(JSON.parse(JSON.stringify(result)));
        resultCount--;

        // return consolidated result
        if (resultCount === 0) {
          response.status(200).send(JSON.stringify({
            "response": results
          }));
        }
      });
    });
  }
};

exports.deleteCategory = function(request, response) {
  console.log("CC deleteCategory initialized");

  // internal controller tasks
  CategoryTask.deleteCategory(request.params, function(error, result) {
    console.log("CC deleteCategory resource", result);

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
