import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import TopicList from '/src/client/modules/core/components/topic.list.jsx'
import {PageLoader} from '/src/client/lib/ui.jsx'
import _ from 'underscore'
import AmplitudeService from '/src/client/lib/amplitude.service'

export const composer = ({context, followTopic, unfollowTopic}, onData) => {
  const { Collections, Meteor } = context()

  if (Meteor.subscribe('topics').ready()) {
    const topics = Collections.Topics.find().map((topic) => {
      topic.followersCount = topic.followers.length
      topic.isFollowed = topic.followers
          .filter((follower) => follower.userId === Meteor.userId())
          .length > 0
      return topic
    })

    const topicsSortedByFollowers = _.sortBy(topics, (topic) => topic.followersCount).reverse()
    const topicsSortedByTime = _.sortBy(topics, (topic) => topic.createdAt).reverse()
    onData(null, { topics, topicsSortedByFollowers, topicsSortedByTime })
  }
}

const depMapper = (context, actions) => ({
  context: () => context,
  showAddTopicModal: actions.topics.showAddTopicModal,
  followTopic: (args) => {
    AmplitudeService.track('topic/follow', { from: 'topic/list' })
    return actions.topics.follow(args)
  },
  unfollowTopic: (args) => {
    AmplitudeService.track('topic/unfollow', { from: 'topic/list' })
    return actions.topics.unfollow(args)
  },
  navigateToTopic: actions.topics.navigateToTopic,
  showLoginAlert: actions.global.showLoginAlert
})

export default composeAll(
  composeWithTracker(composer, PageLoader),
  useDeps(depMapper)
)(TopicList)
