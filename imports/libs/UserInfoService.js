// validates emails/firstnames/lastnames
export default class UserInfoService {
  static validateEmail (email) {
    var error = {}

    if (!email) {
      error = {
        type: 'email',
        reason: 'The email field is required'
      }
    }

    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!re.test(email)) {
      error = {
        type: 'email',
        reason: 'Please enter a valid email address.'
      }
    }

    return error
  }

  static validateName (name) {
    var error = {}

    if (!name) {
      return error
    }

    if (!name.length > 16) {
      error = {
        type: 'name',
        reason: 'Name must consist of fewer than 16 characters.'
      }
    }

    return error
  }
}
