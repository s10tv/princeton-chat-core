import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Invites } from '/lib/collections'
import { validator } from '/lib/validation/request-invite-validation'

export default class OnboardManager {

  signup ({ firstName, lastName, classYear, emailAddress} ) {

  }

  verifyAffiliation (options) {
    const errors = validator(options)
    if (errors.length > 0) {
      throw new Meteor.Error(400, errors)
    }

    return Invites.insert(options)
  }
}
