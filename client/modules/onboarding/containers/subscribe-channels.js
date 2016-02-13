import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import SubscribeChannels from '../components/subscribe-channels.jsx'

import UserService from '/lib/user.service.js'

export const composer = ({context}, onData) => {
  const {Meteor, Collections} = context()

  if (Meteor.subscribe('topics').ready()) {
    // TODO: This should be part of context, mostly everything should be dependency injected
    const user = UserService.currentUser()
    if (user) {
      const channels = user ? Collections.Topics.find({
        _id: {$in: user.followingTopics}
      }).fetch() : []

      onData(null, {
        isLoggedIn: true,
        channels: channels
      })
    }
  }
}

const depsMapper = (context, actions) => ({
  onNext: actions.onboardChannels.next,
  store: context.store,
  context: () => context
})

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(SubscribeChannels)
