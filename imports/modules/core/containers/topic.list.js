import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';
import TopicList, {TopicGrid} from '../components-refactor/topic.list.jsx';
import {Loading} from '/imports/modules/core/components/helpers.jsx'

export const composer = ({context, followTopic, unfollowTopic}, onData) => {
  const { Collections, Meteor } = context();

  if (Meteor.subscribe('topicsToFollow').ready()) {
    const topics = Topics.find().map(topic => {
      topic.followersCount = topic.followers.length;
      topic.isFollowed = topic.followers.filter(follower => follower.userId == Meteor.userId()).length > 0;
      return topic;
    })

    onData(null, { topics });
  }
};

export const TopicGridContainer = composeAll(
  composeWithTracker(composer, Loading),
  useDeps((context, actions) => ({
    context: () => context,
    followTopic: actions.topics.follow,
    unfollowTopic: actions.topics.unfollow,
  }))
)(TopicGrid)


export default composeAll(
  composeWithTracker(composer, Loading),
  useDeps((context, actions) => ({
    context: () => context,
    followTopic: actions.topics.follow,
    unfollowTopic: actions.topics.unfollow,
  }))
)(TopicList)
