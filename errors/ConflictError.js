const { CONFLICT } = require("../utils/errors");

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = CONFLICT;
  }
}

module.exports = ConflictError;
