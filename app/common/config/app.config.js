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
        "NORMAL": 1,
        "MANAGER": 1000,
        "SUPER": 2000,
        "ADMIN": 2048
    }
};
