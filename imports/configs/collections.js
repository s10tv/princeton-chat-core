import {Mongo} from 'meteor/mongo';
import Topics from './collections/topic';
import TopicHeaders from './collections/topicHeader';
import Comments from './collections/comment';
import Posts from './collections/post';
import Users from './collections/user';
import Messages from './collections/message';

export default {
  Topics,
  TopicHeaders,
  Posts,
  Comments,
  Users,
  Messages
};
