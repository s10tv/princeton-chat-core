import {Meteor} from 'meteor/meteor'
import {check} from 'meteor/check'
import {Messages} from '/imports/configs/collections'
import UserService from '/imports/libs/user.service'

export default function () {
  Meteor.methods({
    'messages/insert'(_id, postId, content) {
      check(_id, String);
      check(postId, String);
      check(content, String);

      const createdAt = new Date();
      const ownerId = UserService.currentUser()._id;

      const post = {
        _id, postId, content, ownerId, createdAt,
      };

      Messages.insert(post);
    }
  });
}
