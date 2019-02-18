"use strict";

var TagTask = require("../models/faqTagModel.js");

exports.getTag = function(request, response) {
  console.log("CC getTag initialized");

  // internal controller tasks
  TagTask.getTag(request.params, function(error, result) {
    console.log("TC getTag resource", result);

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

exports.addTag = function(request, response) {
  console.log("TC addTag initialized");

  // internal controller tasks
  if (request.body && Array.isArray(request.body)) {
    let results = [];
    let resultCount = request.body.length;

    // [{"tag":"value1"},{"tag":"value2"},{"tag":"value3"},{"tag":"value4"},{"tag":"value5"},{"tag":"value6"}]
    request.body.forEach(function(tag, index) {
      TagTask.addTag([tag], function(error, result) {
        console.log("CC addTag resource", result);

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

exports.renameTag = function(request, response) {
  console.log("TC renameTag initialized");

  // internal controller tasks
  if (request.body && Array.isArray(request.body)) {
    let results = [];
    let resultCount = request.body.length;

    // [{"tag":"value1", "renameTo":"value12"},{"tag":"value2", "renameTo":"value22"},{"tag":"value3", "renameTo":"value32"},{"tag":"value4", "renameTo":"value42"},{"tag":"value5", "renameTo":"value52"},{"tag":"value6", "renameTo":"value62"}]
    request.body.forEach(function(item, index) {
      TagTask.renameTag([item.tag, item.renameTo], function(error, result) {
        console.log("CC renameTag resource", result);

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

exports.deleteTag = function(request, response) {
  console.log("TC deleteTag initialized");

  // internal controller tasks
  TagTask.deleteTag(request.params, function(error, result) {
    console.log("TC deleteTag resource", result);

    if (error) {
      response.status(500).send(JSON.stringify({
        "error": error
      }));
    }

    response.send(JSON.stringify({
      "response": result
    }));
  });
};
