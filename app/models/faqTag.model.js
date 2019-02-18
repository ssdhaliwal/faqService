"user strict";
const dbFaqPool = require("../common/faq.db.js");

//Tag object constructor
var Tag = function(tag) {
  this.tag = tag.tag;
  this.status = tag.status;
  this.created_at = new Date();
};

Tag.getTag = function getTag(params, result) {
  dbFaqPool.getConnection(function(error, connection) {
    if (error) {
      console.log("dbPool getTag connection error", error);
      throw error;
    }

    // check if params were provided
    let sqlWhere = "";
    let sqlParam = [];
    if (params.id) {
      sqlWhere = " where (id = ?)";
      sqlParam.push(params.id);
    } else if (params.name) {
      sqlWhere = " where (tag like ?)";
      sqlParam.push(params.name + "%");
    }

    // execute the query and return the resutl
    connection.query("SELECT id, tag, contentCount, dateUpdated from vw_faq_tags" + sqlWhere,
      sqlParam,
      function(error, answer) {
        connection.release();

        if (error) {
          console.log("TC/M getTag error", error);
          result(null, error);
        } else {
          console.log("TC/M getTag task", answer);

          result(null, answer);
        }
      });
  });
};

Tag.addTag = function addTag(params, result) {
  dbFaqPool.getConnection(function(error, connection) {
    if (error) {
      console.log("dbPool addTag connection error", error);
      throw error;
    }

    // set procedure and options
    let sqlOptions = {
      "sql": "call spi_faq_tags(?, @id);select @id as id",
      nestTables: true
    };

    // execute the query and return the resutl
    connection.query(sqlOptions,
      params,
      function(error, rows) {
        connection.release();

        if (error) {
          console.log("TC/M addTag error", error);
          result(null, error);
        } else {
          let rowArray = Object.values(JSON.parse(JSON.stringify(rows)));
          console.log("TC/M addTag task", rowArray[1][0][""]);
          result(null, rowArray[1][0][""]);
        }
      });
  });
};

Tag.renameTag = function renameTag(params, result) {
  dbFaqPool.getConnection(function(error, connection) {
    if (error) {
      console.log("dbPool renameTag connection error", error);
      throw error;
    }

    // set procedure and options
    let sqlOptions = {
      "sql": "call spur_faq_tags(?, ?, @count, @id);select @count as count, @id as id",
      nestTables: true
    };

    // execute the query and return the resutl
    connection.query(sqlOptions,
      params,
      function(error, rows) {
        connection.release();

        if (error) {
          console.log("TC/M renameTag error", error);
          result(null, error);
        } else {
          let rowArray = Object.values(JSON.parse(JSON.stringify(rows)));
          console.log("TC/M renameTag task", rowArray);
          result(null, rowArray[1][0][""]);
        }
      });
  });
};

Tag.deleteTag = function deleteTag(params, result) {
  dbFaqPool.getConnection(function(error, connection) {
    if (error) {
      console.log("dbPool deleteTag connection error", error);
      throw error;
    }

    // check if params were provided
    let sqlQuery = "";
    let sqlParam = [];
    if (params.id) {
      sqlQuery = "call spd_faq_tags_id(?, @id);select @id as id";
      sqlParam.push(params.id);
    } else if (params.name) {
      sqlQuery = "call spd_faq_tags_name(?, @id);select @id as id";
      sqlParam.push(params.name);
    }

    // set procedure and options
    let sqlOptions = {
      "sql": sqlQuery,
      nestTables: true
    };

    // execute the query and return the resutl
    connection.query(sqlOptions,
      sqlParam,
      function(error, answer) {
        connection.release();

        if (error) {
          console.log("TC/M deleteTag error", error);
          result(null, error);
        } else {
          let rowArray = Object.values(JSON.parse(JSON.stringify(answer)));
          console.log("TC/M deleteTag task", rowArray);

          result(null, rowArray[1][0][""]);
        }
      });
  });
};

module.exports = Tag;
