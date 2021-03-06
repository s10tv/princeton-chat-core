import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import SubscribeChannels from '../components/subscribe.channels.jsx'
import UserService from '/lib/user.service.js'

export const composer = ({context}, onData) => {
  const {Collections} = context()
  const user = UserService.currentUser()
  if (user) {
    const channels = user ? Collections.Topics.find({
      _id: {$in: user.followingTopics}
    }).fetch() : []
    onData(null, {
      isTopicClickable: false,
      hasSelectedThreeChannels: user ? user.followingTopics.length >= 3 : false,
      channels: channels
    })
  }
}

const depsMapper = (context, actions) => ({
  onNext: actions.onboardingSubscribeChannels.next,
  store: context.store,
  context: () => context
})

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(SubscribeChannels)
