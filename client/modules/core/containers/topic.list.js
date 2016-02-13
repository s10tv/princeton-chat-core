import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import TopicList from '/client/modules/core/components/topic.list.jsx'
import {Loading} from '/client/modules/core/components/helpers.jsx'
import _ from 'underscore'
import sweetalert from 'sweetalert'

export const composer = ({context, followTopic, unfollowTopic}, onData) => {
  const { Collections, Meteor } = context()

  const topics = Collections.Topics.find().map((topic) => {
    topic.followersCount = topic.followers.length
    topic.isFollowed = topic.followers
      .filter((follower) => follower.userId === Meteor.userId())
      .length > 0
    return topic
  })

  const showSweetAlertToLogin = () => sweetalert({
    imageUrl: '/images/coffee.svg',
    imageSize: '100x100',
    text: "We'd give you access and treat you with hot chocolate. We'd even wrap you in a warm blanket. We have one slight problem though. You're not logged in :c",
    title: 'Please log in first'
  })

  const topicsSortedByFollowers = _.sortBy(topics, (topic) => topic.followersCount).reverse()
  const topicsSortedByTime = _.sortBy(topics, (topic) => topic.createdAt).reverse()

  onData(null, { topics, topicsSortedByFollowers, topicsSortedByTime, showSweetAlertToLogin })
}

const depMapper = (context, actions) => ({
  context: () => context,
  showAddTopicModal: actions.topics.showAddTopicModal,
  followTopic: actions.topics.follow,
  unfollowTopic: actions.topics.unfollow,
  navigateToTopic: actions.topics.navigateToTopic
})

export default composeAll(
  composeWithTracker(composer, Loading),
  useDeps(depMapper)
)(TopicList)
