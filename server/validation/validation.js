class Validation {
  static isValidUsername(username) {
    /*
    ** Username can contain alphanumeric characters as well as one special
    ** character [_ . -] and should be 3 to 25 characters long
    */
    var ree = new RegExp('[a-zA-Z0-9_.-]{3,25}');
    return ree.test(username);
  }

  static isValidFirstName(firstName) {
    /*
    ** Last name should consist of letters and should be 3 to 255 characters
    ** long
    */
    var ree = new RegExp('[a-zA-Z]{3,255}');
    return ree.test(firstName);
  }

  static isValidLastName(lastName) {
    /*
    ** Last name should consist of letters and should be 3 to 255 characters
    ** long
    */
    var ree = new RegExp('[a-zA-Z]{3,255}');
    return ree.test(lastName);
  }

  static isValidEmail(email) {
    /*
    ** Email regex expression taken from
    ** https://emailregex.com/
    */
    var ree = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g
    return email.match(ree) && true || false;
  }

  static isValidPassword(password) {
    /*
    ** Password must be at least 8 characters and should contain at least one
    ** lower-case letter, one upper-case letter, and one number
    */
    var ree = new RegExp('(?=.*[a-z]+.*$)(?=.*[A-Z]+.*$)(?=.*[0-9]+.*$).{8,100}$');
    return ree.test(password);
  }

  static isValidBiography(biography) {
    /*
    ** Biography must be less than 400 characters
    */
   var ree = new RegExpr('.{0,400}$');
   return ree.test(biography);
  }

  static imagePath(imagePath) {
    /*
    ** Extract image filename from resource path
    */
    var re = new RegExp(/^.*[\/\\]+(.+\..+)$/);
    return re.exec(imagePath)[1];
  }
}

module.exports = {
  Validation
}