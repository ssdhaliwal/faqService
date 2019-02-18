"user strict";
const dbAdminPool = require("../common/admin.db.js");

//Category object constructor
var Admin = function(admin) {
  this.admin = admin.admin;
  this.status = category.status;
  this.created_at = new Date();
};

Admin.getUser = function getUser(params, result) {
  dbAdminPool.getConnection(function(error, connection) {
    if (error) {
      console.log("dbPool getUser connection error", error);
      throw error;
    }

    // check if params were provided
    let sqlQuery = "";
    let sqlWhere = "";
    let sqlParam = [];
    if (params.id) {
      sqlQuery = "SELECT firstName, lastName, email, permissionLevel from vw_users";
      sqlWhere = " where (id = ?)";
      sqlParam.push(params.id);
    } else if (params.firstName && params.lastName) {
      sqlQuery = "SELECT firstName, lastName, email, permissionLevel from vw_users";
      sqlWhere = " where (firstName = ?) and (lastName = ?)";
      sqlParam.push(params.firstName);
      sqlParam.push(params.lastName);
    } else if (params.email) {
      sqlQuery = "SELECT firstName, lastName, email, permissionLevel, password from vw_users";
      sqlWhere = " where (email = ?)";
      sqlParam.push(params.email);
    }

    // execute the query and return the resutl
    connection.query(sqlQuery + sqlWhere,
      sqlParam,
      function(error, answer) {
        connection.release();

        if (error) {
          console.log("Admin getUser error", error);
          result(error, null);
        } else {
          console.log("Admin getUser task", answer);
          result(null, answer);
        }
      });
  });
};

Admin.addUser = function addUser(params, result) {
  dbAdminPool.getConnection(function(error, connection) {
    if (error) {
      console.log("dbPool addUser connection error", error);
      throw error;
    }

    // set procedure and options
    let sqlOptions = {
      "sql": "call spi_admin_user(?, ?, ?, ?, ?, @id);select @id as id",
      nestTables: true
    };

    // execute the query and return the resutl
    connection.query(sqlOptions,
      params,
      function(error, rows) {
        connection.release();

        if (error) {
          console.log("Admin addUser error", error);
          result(error, null);
        } else {
          let rowArray = Object.values(JSON.parse(JSON.stringify(rows)));
          console.log("Admin addUser task", rowArray[1][0][""]);
          result(null, rowArray[1][0][""]);
        }
      });
  });
};

Admin.deleteUser = function deleteUser(params, result) {
  dbAdminPool.getConnection(function(error, connection) {
    if (error) {
      console.log("dbPool deleteUser connection error", error);
      throw error;
    }

    // check if params were provided
    let sqlParam = [];
    if (params.id) {
      sqlParam.push("$!$i$!$d$!$");
      sqlParam.push(params.id);
    } else if (params.firstName && params.lastName) {
      sqlParam.push(params.firstName);
      sqlParam.push(params.lastName);
    }

    // set procedure and options
    let sqlOptions = {
      "sql": "call spd_admin_user(?, ?, @id);select @id as id",
      nestTables: true
    };

    // execute the query and return the resutl
    connection.query(sqlOptions,
      sqlParam,
      function(error, answer) {
        connection.release();

        if (error) {
          console.log("Admin/M deleteUser error", error);
          result(error, null);
        } else {
          let rowArray = Object.values(JSON.parse(JSON.stringify(answer)));
          console.log("Admin/M deleteUser task", rowArray);

          result(null, rowArray[1][0][""]);
        }
      });
  });
};

module.exports = Admin;
