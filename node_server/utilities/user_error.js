
//Source: https://stackoverflow.com/questions/464359/custom-exception-type
//Custom exceptions
class UserError extends Error {
    constructor(message) {
      super(message); // (1)
      this.name = "UserError"; // (2)
    }
}

module.exports = UserError

