export default function ({Meteor, Collections, currentUser}) {
  const {Notifications, Messages, Posts, Topics, AmaPosts,
    AmaMessages, AmaActivities} = Collections

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
            lastActionTimestamp: message.createdAt,
            reason: message.createdAt ? 'reply' : 'newpost',
            status: 'active'
          })
        })
      },

      'dev/ama/create': () => {
        const user = currentUser()

        Topics.upsert({ _id: 'ama' }, {$set: {
          displayName: 'AMA',
          type: 'ama'
        }})

        AmaPosts.upsert({_id: 'qimingama'}, {$set: {
          _id: 'qimingama',
          speakerId: user._id,
          title: 'Qiming Fang: Talk about being B0$$',
          introText: 'Qiming is a boss. What can you say?',
          startTime: new Date()
        }})

        AmaMessages.upsert({_id: 'qimingama-msg1'}, { $set: {
          _id: 'qimingama-msg1',
          ownerId: user._id,
          amaPostId: 'qimingama',
          content: 'What is your favorite fruit?',
          childrenMessageIds: [
            'qimingama-msg-reply'
          ]
        }})

        AmaMessages.upsert({_id: 'qimingama-msg-reply'}, { $set: {
          _id: 'qimingama-msg-reply',
          ownerId: user._id,
          amaPostId: 'qimingama',
          parentMessageId: 'qimingama-msg1',
          parentMessageOwner: user._id,
          content: 'Banannas are my favorite fruit'
        }})

        AmaMessages.upsert({_id: 'qimingama-msg2'}, { $set: {
          _id: 'qimingama-msg2',
          ownerId: user._id,
          amaPostId: 'qimingama',
          content: 'Why is my foot hurting?'
        }})

        AmaActivities.upsert({_id: 'qimingama-msg1-activity'}, { $set: {
          _id: 'qimingama-msg1-activity',
          title: `${user.firstName} asked a new question`,
          content: 'What is your favorite fruit?',
          originatorUserId: user._id,
          amaPostId: 'qimingama',
          amaMessageId: 'qimingama-msg1'
        }})

        AmaActivities.upsert({_id: 'qimingama-msg1-reply-activity'}, { $set: {
          _id: 'qimingama-msg1-reply-activity',
          title: `${user.firstName} replied to ${user.firstName}'s question'`,
          content: 'Banannas are my favorite fruit',
          originatorUserId: user._id,
          amaPostId: 'qimingama',
          amaMessageId: 'qimingama-msg-reply'
        }})
      }
    })
  }
}
