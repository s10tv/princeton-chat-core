import {Meteor} from 'meteor/meteor'
import {check} from 'meteor/check'
import {Messages} from '/lib/collections'
import UserService from '/lib/user.service.js'

export default function () {
  Meteor.methods({
    'messages/insert' (_id, postId, content) {
      check(_id, String)
      check(postId, String)
      check(content, String)

      const createdAt = new Date()
      const ownerId = UserService.currentUser()._id

      const post = {
        _id, postId, content, ownerId, createdAt
      }

      Messages.insert(post)
    }
  })
}
