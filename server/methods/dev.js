export default function ({Meteor, Collections, currentUser}) {
  const {Notifications, Posts} = Collections

  if (process.env.ENV === 'dev') {
    Meteor.methods({
      'dev/notification/generate': () => {
        const user = currentUser()

        Posts.find({}, { limit: 10 }).map((post) => {
          Notifications.insert({
            ownerId: user._id,
            postId: post._id,
            status: 'active'
          })
        })
      }
    })
  }
}
