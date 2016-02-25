export default function ({Meteor, Collections, UserService}) {
  const {Messages} = Collections
  Meteor.methods({
    'messages/insert' (_id, postId, content) {
      const createdAt = new Date()
      const ownerId = UserService.currentUser()._id

      const post = {
        _id, postId, content, ownerId, createdAt
      }

      Messages.insert(post)
    }
  })
}
