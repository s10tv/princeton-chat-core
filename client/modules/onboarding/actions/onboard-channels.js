import ErrorHandler from '/client/modules/onboarding/lib/error.handler'
import UserService from '/lib/user.service'

export default {
  next ({FlowRouter}) {
    // TODO: extract this into context
    const currentUser = UserService.currentUser()

    if (currentUser.followingTopics.length === 0) {
      return ErrorHandler.error('Please follow some topics')
    }

    return FlowRouter.go('invite-friends')
  }
}
