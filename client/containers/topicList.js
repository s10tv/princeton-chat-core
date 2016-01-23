import TopicList from '../components/TopicList.jsx';
import {useDeps} from 'react-simple-di';
import {composeWithTracker, composeAll} from 'react-komposer';

export const composer = ({context, topicId}, onData) => {
  const {Meteor, Collections, Tracker} = context();

  if (Meteor.subscribe('posts', topicId).ready()) {
    const topic = Collections.Topics.findOne(topicId);
    const posts = Collections.Posts.find({ topicIds: topicId }).map((post) => {
      post.owner = Collections.Users.findOne(post.ownerId);
      return post;
    })

    onData(null, {topic, posts});
  }
};

export default composeAll(
  composeWithTracker(composer),
  useDeps(),
)(TopicList);
