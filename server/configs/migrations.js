import AvatarService from '/lib/avatar.service.js'

export default function ({ Migrations, Collections }) {
  const {Users, Topics, Posts, Messages} = Collections

  Migrations.add({
    version: 1,
    name: 'Adds default topics to the DB',
    up: function () {
      const topics = [
        { key: 'general', value: 'General', order: 1 },
        { key: 'software', value: 'Software', order: 2 },
        { key: 'marketing', value: 'Marketing', order: 3 },
        { key: 'housing', value: 'Housing', order: 4 },
        { key: 'jobs', value: 'Jobs', order: 5 },
        { key: 'legal', value: 'Legal', order: 6 }
      ]

      topics.forEach((topic) => {
        Topics.upsert({ _id: topic.key }, { $set: {
          displayName: topic.value,
          order: topic.order,
          followers: [],
          numPosts: Posts.find({ isDM: { $ne: true }, topicIds: topic._id }).count()
        }})
      })
    }
  })

  Migrations.add({
    version: 2,
    name: 'Adds tigerbot to the prepopulated data',
    up: function () {
      Users.upsert('system', { $set: {
        avatar: {
          url: '/images/tigerbot.png'
        },
        username: 'tigerbot',
        firstName: 'Tigerbot',
        lastName: ''
      }})
    }
  })

  Migrations.add({
    version: 3,
    name: 'Add source for existing messages',
    up: function () {
      Messages.find().forEach((message) => {
        if (!message.source) {
          Messages.update(message._id, { $set: {
            source: 'web'
          }})
        }
      })
    }
  })

  Migrations.add({
    version: 4,
    name: 'Add description to topics',
    up: function () {
      Topics.find().forEach((topic) => {
        if (!topic.description) {
          Topics.update(topic._id, { $set: {
            description: 'This topic needs a description.'
          }})
        }
      })
    }
  })

  Migrations.add({
    version: 5,
    name: 'Add isFullMember field to users',
    up: function () {
      Users.find().forEach((user) => {
        if (user.isFullMember === undefined) {
          Users.update(user._id, { $set: {
            isFullMember: true
          }})
        }
      })
    }
  })

  Migrations.add({
    version: 6,
    name: 'Every princeton shield avatar is changed to a different default one',
    up: function () {
      Users.find().forEach((user) => {
        if (user.avatar && user.avatar.url === '/images/princeton.svg') {
          Users.update(user._id, { $set: {
            avatar: {
              url: AvatarService.generateDefaultAvatarForAudience(),
              isDefaultAvatar: true,
              color: AvatarService.generateRandomColorForDefaultAvatar()
            }
          }})
        }
      })
    }
  })

  Migrations.add({
    version: 7,
    name: 'Every topic should have a cover image',
    up: function () {
      Topics.find().forEach((topic) => {
        if (!topic.cover) {
          Topics.update(topic._id, { $set: {
            cover: {
              url: 'https://images.unsplash.com/photo-1436407886995-41f8f5ee43ad?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=6f2e9aea816890a2eff88bc302840266&w=1200&h=800',
              width: 1200,
              height: 800
            }
          }})
        }
      })
    }
  })

  Migrations.add({
    version: 8,
    name: 'Every topic should have an owner',
    up: function () {
      Topics.find().forEach((topic) => {
        if (!topic.ownerId) {
          Topics.update(topic._id, { $set: {
            ownerId: 'system'
          }})
        }
      })
    }
  })

  Migrations.add({
    version: 9,
    name: 'Every topic should have a createdAt',
    up: function () {
      Topics.find().forEach((topic) => {
        if (!topic.createdAt) {
          Topics.update(topic._id, { $set: {
            createdAt: new Date(0)
          }})
        }
      })
    }
  })
}
