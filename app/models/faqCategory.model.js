"user strict";
const dbFaqPool = require("../common/faq.db.js");

//Category object constructor
var Category = function(category) {
  this.category = category.category;
  this.status = category.status;
  this.created_at = new Date();
};

Category.getCategory = function getCategory(params, result) {
  dbFaqPool.getConnection(function(error, connection) {
    if (error) {
      console.log("dbPool getCategory connection error", error);
      throw error;
    }

    // check if params were provided
    let sqlWhere = "";
    let sqlParam = [];
    if (params.id) {
      sqlWhere = " where (id = ?)";
      sqlParam.push(params.id);
    } else if (params.name) {
      sqlWhere = " where (category like ?)";
      sqlParam.push(params.name + "%");
    }

    // execute the query and return the resutl
    connection.query("SELECT id, category, contentCount, dateUpdated from vw_faq_categories" + sqlWhere,
      sqlParam,
      function(error, answer) {
        connection.release();

        if (error) {
          console.log("CC/M getCategory error", error);
          result(null, error);
        } else {
          console.log("CC/M getCategory task", answer);

          result(null, answer);
        }
      });
  });
};

Category.addCategory = function addCategory(params, result) {
  dbFaqPool.getConnection(function(error, connection) {
    if (error) {
      console.log("dbPool addCategory connection error", error);
      throw error;
    }

    // set procedure and options
    let sqlOptions = {
      "sql": "call spi_faq_categories(?, @id);select @id as id",
      nestTables: true
    };

    // execute the query and return the resutl
    connection.query(sqlOptions,
      params,
      function(error, rows) {
        connection.release();

        if (error) {
          console.log("CC/M addCategory error", error);
          result(null, error);
        } else {
          let rowArray = Object.values(JSON.parse(JSON.stringify(rows)));
          console.log("CC/M addCategory task", rowArray[1][0][""]);
          result(null, rowArray[1][0][""]);
        }
      });
  });
};

Category.renameCategory = function renameCategory(params, result) {
  dbFaqPool.getConnection(function(error, connection) {
    if (error) {
      console.log("dbPool renameCategory connection error", error);
      throw error;
    }

    // set procedure and options
    let sqlOptions = {
      "sql": "call spur_faq_categories(?, ?, @count, @id);select @count as count, @id as id",
      nestTables: true
    };

    // execute the query and return the resutl
    connection.query(sqlOptions,
      params,
      function(error, rows) {
        connection.release();

        if (error) {
          console.log("CC/M renameCategory error", error);
          result(null, error);
        } else {
          let rowArray = Object.values(JSON.parse(JSON.stringify(rows)));
          console.log("CC/M renameCategory task", rowArray);
          result(null, rowArray[1][0][""]);
        }
      });
  });
};

Category.deleteCategory = function deleteCategory(params, result) {
  dbFaqPool.getConnection(function(error, connection) {
    if (error) {
      console.log("dbPool deleteCategory connection error", error);
      throw error;
    }

    // check if params were provided
    let sqlQuery = "";
    let sqlParam = [];
    if (params.id) {
      sqlQuery = "call spd_faq_categories_id(?, @id);select @id as id";
      sqlParam.push(params.id);
    } else if (params.name) {
      sqlQuery = "call spd_faq_categories_name(?, @id);select @id as id";
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
          console.log("CC/M deleteCategory error", error);
          result(null, error);
        } else {
          let rowArray = Object.values(JSON.parse(JSON.stringify(answer)));
          console.log("CC/M deleteCategory task", rowArray);

          result(null, rowArray[1][0][""]);
        }
      });
  });
};

module.exports = Category;
