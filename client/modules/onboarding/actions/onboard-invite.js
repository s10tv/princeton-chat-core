import ErrorHandler from '/client/modules/onboarding/lib/error.handler'
import { filterInvitees } from '/lib/validation/onboard-invite-validation'

export default {
  invite ({Meteor}, { invitees }) {
    Meteor.call('welcome/invite', filterInvitees(invitees), (err) => {
      if (err) {
        return ErrorHandler.error(err)
      }
    })
  }
}
