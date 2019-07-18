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
    ** Password should contain at least one letter, one number and one special
    ** character [! @ # $ % ^ & * _ . - = +] and should be at least 8 characterrs long
    */
    var ree = new RegExp('(?=.*[a-zA-Z]+.*$)(?=.*[0-9]+.*$)(?=.*[!@#$%^&*_.\-=+]+.*$)[a-zA-Z0-9!@#$%^&*_.\-=+]{8,100}$');
    return ree.test(password);
  }

}

module.exports = {
  Validation
}