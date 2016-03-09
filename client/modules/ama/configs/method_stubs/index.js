export default function ({Meteor, Collections, UserService}) {
  const {AmaMessages} = Collections

  if (Meteor.userId()) {
    Meteor.methods({
      'ama/upvote' ({messageId}) {
        const message = AmaMessages.findOne(messageId)
        if (message.upvotedUsers.indexOf(Meteor.userId()) === -1) {
          AmaMessages.update(messageId, { $addToSet: {
            upvotedUsers: Meteor.userId()
          }})
        } else {
          AmaMessages.update(messageId, { $pull: {
            upvotedUsers: Meteor.userId()
          }})
        }
      }
    })
  }
}
