"use strict";

module.exports = {
    "httpPort": 3080,
    "httpsPort": 443,
    "appEndpoint": "http://localhost:3080",
    "appEndpointSecure": "https://localhost:443",
    "database": {
      "admin": {
        "user": "admin",
        "password": "admin!user",
        "host": "localhost"
      },
      "faq": {
        "user": "faq",
        "password": "faq!user",
        "host": "localhost"
      }
    },
    "jwt_secret": "myS33!!creeeT",
    "jwt_expiration_in_seconds": 3600,
    "environment": "dev",
    "permissionLevels": {
        "NORMAL": 100,
        "CUSTOMER": 200,
        "CUSTOMER_TEAM": 205,
        "CUSTOMER_ADMIN": 210,
        "SERVICE": 300,
        "SERVICE_TEAM": 305,
        "SERVICE_ADMIN": 310,
        "SERVICE_MANAGER": 315,
        "PLANNING": 400,
        "PLANNING_TEAM": 405,
        "PLANNING_ADMIN": 410,
        "SALES": 500,
        "SALES_TEAM": 505,
        "SALES_ADMIN": 510,
        "SALES_MANAGER": 515,
        "MANAGER": 1000,
        "SUPER": 2000,
        "ADMIN": 2048
    }
};
