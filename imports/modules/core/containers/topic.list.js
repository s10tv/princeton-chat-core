import TopicList from '../components/topic.list.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';

export const composer = ({context}, onData) => {
  const { Collections, Meteor } = context();

  if (Meteor.subscribe('topicsToFollow').ready()) {
    const topics = Topics.find().map(topic => {
      topic.followersCount = topic.followers.length;
      topic.isFollowed = topic.followers.filter(follower => follower.userId == Meteor.userId()).length > 0;
      topic.onFollowToggle = function(e, isInputChecked) {
        if (isInputChecked) {
          Meteor.call('topic/follow', topic._id);
        } else {
          Meteor.call('topic/unfollow', topic._id);
        }
      };

      return topic;
    })

    onData(null, { topics });
  }
};

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(TopicList);
