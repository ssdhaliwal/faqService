module.exports = {
    "port": 3080,
    "appEndpoint": "http://localhost:3080",
    "apiEndpoint": "http://localhost:3080",
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
    "jwt_expiration_in_seconds": 60,
    "environment": "dev",
    "permissionLevels": {
        "NORMAL": 1,
        "SUPER": 2000,
        "ADMIN": 2048
    }
};
