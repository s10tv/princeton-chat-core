import TopicList from '../components/topic.list.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';

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

export default composeAll(
  composeWithTracker(composer),
  useDeps((context, actions) => ({
    context: () => context,
    followTopic: actions.topics.follow,
    unfollowTopic: actions.topics.unfollow,
  }))
)(TopicList);
