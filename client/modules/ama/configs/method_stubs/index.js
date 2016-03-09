export default function ({Meteor, Collections, UserService}) {
  const {AmaMessages} = Collections
  const currentUser = UserService.currentUser()

  Meteor.methods({
    'ama/upvote' ({messageId}) {
      const message = AmaMessages.findOne(messageId)
      if (message.upvotedUsers.indexOf(currentUser._id) === -1) {
        AmaMessages.update(messageId, { $addToSet: {
          upvotedUsers: currentUser._id
        }})
      } else {
        AmaMessages.update(messageId, { $pull: {
          upvotedUsers: currentUser._id
        }})
      }
    }
  })
}
