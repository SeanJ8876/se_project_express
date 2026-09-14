const { NOT_FOUND } = require("../utils/errors");

class NotFoundError extends Error {
  constructor(message = "Not Found") {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = NOT_FOUND;
  }
}

module.exports = NotFoundError;
