import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra'
import TopicList, {TopicGrid} from '/imports/modules/core/components/topic.list.jsx'
import {Loading} from '/imports/modules/core/components/helpers.jsx'

export const composer = ({context, followTopic, unfollowTopic}, onData) => {
  const { Collections, Meteor } = context()

  const topics = Collections.Topics.find().map((topic) => {
    topic.followersCount = topic.followers.length
    topic.isFollowed = topic.followers
      .filter((follower) => follower.userId === Meteor.userId())
      .length > 0
    return topic
  })

  onData(null, { topics })
}

export const TopicGridContainer = composeAll(
  composeWithTracker(composer, Loading),
  useDeps((context, actions) => ({
    context: () => context,
    showAddTopicModal: actions.topics.showAddTopicModal,
    followTopic: actions.topics.follow,
    unfollowTopic: actions.topics.unfollow
  }))
)(TopicGrid)

export default composeAll(
  composeWithTracker(composer, Loading),
  useDeps((context, actions) => ({
    context: () => context,
    showAddTopicModal: actions.topics.showAddTopicModal,
    followTopic: actions.topics.follow,
    unfollowTopic: actions.topics.unfollow
  }))
)(TopicList)
