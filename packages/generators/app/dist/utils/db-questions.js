"use strict";
const DEFAULT_PORTS = {
  postgres: 5432,
  mysql: 3306,
  sqlite: void 0
};
const database = ({ scope }) => ({
  type: "input",
  name: "database",
  message: "Database name:",
  default: scope.name,
  validate(value) {
    if (value.includes(".")) {
      return `The database name can't contain a "."`;
    }
    return true;
  }
});
const host = () => ({
  type: "input",
  name: "host",
  message: "Host:",
  default: "127.0.0.1"
});
const port = ({ client }) => ({
  type: "input",
  name: "port",
  message: "Port:",
  default: DEFAULT_PORTS[client]
});
const username = () => ({
  type: "input",
  name: "username",
  message: "Username:"
});
const password = () => ({
  type: "password",
  name: "password",
  message: "Password:",
  mask: "*"
});
const ssl = () => ({
  type: "confirm",
  name: "ssl",
  message: "Enable SSL connection:",
  default: false
});
const filename = () => ({
  type: "input",
  name: "filename",
  message: "Filename:",
  default: ".tmp/data.db"
});
const dbQuestions = {
  sqlite: [filename],
  postgres: [database, host, port, username, password, ssl],
  mysql: [database, host, port, username, password, ssl]
};
module.exports = dbQuestions;
//# sourceMappingURL=db-questions.js.map
