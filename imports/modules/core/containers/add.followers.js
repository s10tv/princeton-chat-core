import AddFollowers from '/imports/modules/core/components/addFollowers.jsx'
import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import UserInfoService from '/imports/libs/userinfo.service'

export const composer = ({context, actions, topicId}, onData) => {
  const { Meteor, Collections } = context()

  if (Meteor.subscribe('topics').ready()) {
    const topic = Collections.Topics.findOne(topicId)

    onData(null, {
      topic,
      generateRandomString: () => Meteor.uuid()
    })
  }
}

const depsMapper = (context, actions) => ({
  validateEmail: UserInfoService.validateEmail,
  validateName: UserInfoService.validateName,
  sendInvitations: actions.topics.addNewUsers,
  showSnackbarWithString: actions.topics.showSnackbarWithString,
  context: () => context
})

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(AddFollowers)
