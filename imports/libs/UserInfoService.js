// validates emails/firstnames/lastnames
export default class UserInfoService {
  static validateEmail(email) {
    var error = {};

    if (!email) {
      error = {
        type: 'email',
        reason: 'The email field is required'
      }
    }

    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email)) {
      error = {
        type: 'email',
        reason: 'Please type an actual email'
      }
    }

    return error;
  }

  static validateName(name) {
    var error = {};
    
    if (!name) {
      return error;
    }

    var re = /^[a-zA-Z]+$/;
    if (!re.test(name)) {
      error = {
        type: 'name',
        reason: 'The field should only consist of letters'
      }
    }

    return error;
  }
}
