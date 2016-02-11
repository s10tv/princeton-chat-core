import {useDeps, composeWithTracker, composeAll} from '/client/config/mantra'
import GuestIndex from '../components/guestIndex.jsx'
import {Loading} from '/imports/modules/core/components/helpers.jsx'

export const composer = ({context, followTopic, unfollowTopic}, onData) => {
  const { Collections, Meteor } = context()

  // TODO: Filter by only what I subscribe to
  if (Meteor.subscribe('posts.mine').ready() && Meteor.subscribe('topics.mine').ready()) {
    const topics = Collections.Topics.find().map((topic) => {
      topic.numFollowers = topic.followers.length
      topic.isFollowing = topic.followers.some((f) => f.userId === Meteor.userId())
      return topic
    })
    const posts = Collections.Posts.find({isDM: false}).map((post) => {
      post.numFollowers = post.followers.length
      post.isFollowing = post.followers.some((f) => f.userId === Meteor.userId())
      return post
    })
    onData(null, { topics, posts })
  }
}

export default composeAll(
  composeWithTracker(composer, Loading),
  useDeps((context, actions) => ({
    context: () => context,
    followTopic: actions.topics.follow,
    unfollowTopic: actions.topics.unfollow,
    followPost: actions.posts.follow,
    unfollowPost: actions.posts.unfollow
  }))
)(GuestIndex)
