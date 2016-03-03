export default function ({Meteor, Collections, currentUser}) {
  const {Notifications, Messages, Posts} = Collections

  if (process.env.ENV === 'dev') {
    Meteor.methods({
      'dev/notification/generate': () => {
        const user = currentUser()

        Posts.find({}, { limit: 10 }).map((post) => {
          const message = Messages.findOne({ postId: post._id }, {
            sort: {
              createdAt: -1
            }
          }) || {}

          Notifications.insert({
            ownerId: user._id,
            postId: post._id,
            lastMessageTime: message.createdAt,
            status: 'active'
          })
        })
      }
    })
  }
}
