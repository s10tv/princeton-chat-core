import {Mongo} from 'meteor/mongo';
import Topics from './collections/topic';
import TopicHeaders from './collections/topicHeader';
import Messages from './collections/message';
import Posts from './collections/post';
import Users from './collections/user';

export default {
  Topics,
  TopicHeaders,
  Posts,
  Messages,
  Users,
  Messages
};
