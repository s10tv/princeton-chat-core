import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra'
import GuestIndex from '../components/guestIndex.jsx'

export const composer = ({context, followTopic, unfollowTopic}, onData) => {
  const { Collections, Meteor } = context()
  
  // TODO: Filter by only what I subscribe to
  if (Meteor.subscribe('posts.mine').ready() && Meteor.subscribe('topics.mine').ready()) {
    const topics = Collections.Topics.find().map(topic => {
      topic.followersCount = topic.followers.length
      topic.isFollowing = topic.followers.filter(follower => follower.userId == Meteor.userId()).length > 0
      return topic
    })
    const posts = Collections.Posts.find({isDM: false}).map(post => {
      // post.followersCount = post.followers.length
      // TODO: Obvious fix me...
      post.isFollowing = true
      return post
    })
    onData(null, { topics, posts })
  }
}

export default composeAll(
  composeWithTracker(composer),
  useDeps((context, actions) => ({
    context: () => context,
    followTopic: actions.topics.follow,
    unfollowTopic: actions.topics.unfollow,
    followPost: actions.posts.follow,
    unfollowPost: actions.posts.unfollow,
  }))
)(GuestIndex)
