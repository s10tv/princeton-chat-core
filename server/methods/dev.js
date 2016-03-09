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

        Topics.upsert({ _id: 'qimingama' }, {$set: {
          displayName: 'AMA',
          type: 'ama',
          createdAt: new Date(),
          followers: [],
          numPosts: 0,
          updatedAt: new Date(),
          updatedBy: '0',
          description: 'This topic needs a description.',
          cover: {
            url: 'https://images.unsplash.com/photo-1436407886995-41f8f5ee43ad?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=6f2e9aea816890a2eff88bc302840266&w=1200&h=800',
            width: 1200,
            height: 800
          }
        }})

        AmaPosts.upsert({_id: 'qimingama'}, {$set: {
          _id: 'qimingama',
          speakerId: user._id,
          title: 'Qiming Fang: Talk about being B0$$',
          introText: 'Qiming is a boss. What can you say?',
          cover: {
            url: 'http://gdb.voanews.com/DEC7023F-E583-4902-81CF-4002A702BB1E_cx0_cy4_cw0_mw1024_s_n_r1.jpg'
          },
          participants: [{ userId: user._id, unreadCount: 0 }],
          startTime: new Date(),
          createdAt: new Date()
        }})

        AmaMessages.upsert({_id: 'qimingama-msg1'}, { $set: {
          _id: 'qimingama-msg1',
          ownerId: user._id,
          amaPostId: 'qimingama',
          content: 'What is your favorite fruit?',
          upvotedUsers: [],
          childrenMessageIds: [
            'qimingama-msg-reply'
          ],
          createdAt: new Date()
        }})

        AmaMessages.upsert({_id: 'qimingama-msg-reply'}, { $set: {
          _id: 'qimingama-msg-reply',
          ownerId: user._id,
          amaPostId: 'qimingama',
          parentMessageId: 'qimingama-msg1',
          parentMessageOwner: user._id,
          content: 'Banannas are my favorite fruit',
          upvotedUsers: [],
          createdAt: new Date()
        }})

        AmaMessages.upsert({_id: 'qimingama-msg2'}, { $set: {
          _id: 'qimingama-msg2',
          ownerId: user._id,
          amaPostId: 'qimingama',
          content: 'Why is my foot hurting?',
          upvotedUsers: [],
          createdAt: new Date()
        }})

        AmaActivities.upsert({_id: 'qimingama-msg1-activity'}, { $set: {
          _id: 'qimingama-msg1-activity',
          title: `${user.firstName} asked a new question`,
          content: 'What is your favorite fruit?',
          originatorUserId: user._id,
          amaPostId: 'qimingama',
          amaMessageId: 'qimingama-msg1',
          upvotedUsers: [],
          createdAt: new Date()
        }})

        AmaActivities.upsert({_id: 'qimingama-msg1-reply-activity'}, { $set: {
          _id: 'qimingama-msg1-reply-activity',
          title: `${user.firstName} replied to ${user.firstName}'s question`,
          content: 'Banannas are my favorite fruit',
          originatorUserId: user._id,
          amaPostId: 'qimingama',
          amaMessageId: 'qimingama-msg-reply',
          upvotedUsers: [],
          createdAt: new Date()
        }})
      }
    })
  }
}
