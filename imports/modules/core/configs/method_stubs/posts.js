// import {Posts} from '/imports/configs/collections';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import UserService from '/imports/libs/UserService';

export default function () {
  Meteor.methods({
    'post/insert'(_id, title, content, topicIds) {
      check(_id, String);
      check(title, String);
      check(content, String);
      check(topicIds, [String]);

      const createdAt = new Date();
      const ownerId = UserService.currentUser()._id;

      const post = {
        _id, title, content, topicIds, ownerId, createdAt,
      };
      Posts.insert(post);
    }
  });
}
