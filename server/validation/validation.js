class Validation {
  static isValidUsername(username) {
    var ree = new RegExp('[a-zA-Z0-9_.-]{3,16}');
    return ree.test(username);
  }

  static isValidFirstName() {
    return true;
  }

  static isValidLastName() {
    return true;
  }

  static isValidEmail() {
    return true;
  }

  static isValidPassword() {
    return true;
  }

}

module.exports = {
  Validation
}