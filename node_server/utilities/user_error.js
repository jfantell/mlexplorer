
//Source: https://stackoverflow.com/questions/464359/custom-exception-type
//Custom exceptions
function UserError(message) {
    this.message = message;
}
  
UserError.prototype = new Error;
module.exports = UserError;