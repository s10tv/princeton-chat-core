import {Topics} from '/imports/configs/collections';
import AvatarService from '/imports/libs/AvatarService';

Migrations.add({
  version: 1,
  name: 'Adds default topics to the DB',
  up: function() {

    const topics = [
      { key:"general", value: "General", order: 1},
      { key:"software", value: "Software", order: 2},
      { key:"marketing", value: "Marketing", order: 3},
      { key:"housing", value: "Housing", order: 4},
      { key:"jobs", value: "Jobs", order: 5},
      { key:"legal", value: "Legal", order: 6},
      // { key:"product", value: "Product", order: 2},
      // { key:"artanddesign", value: "Arts & Design", order: 4},
      // { key:"nonprofit", value: "Nonprofit", order: 5},
      // { key:"fundraising", value: "Fundraising", order: 6},
      // { key:"healthcare", value: "Healthcare", order: 7},
      // { key:"finance", value: "Finance", order: 8},
      // { key:"management", value: "Management", order: 9},
      // { key:"hardware", value: "Hardware", order: 11},
      // { key:"science", value: "Science", order: 12},
      // { key:"education", value: "Education", order: 13},
      // { key:"hollywood", value: "Hollywood", order: 14},
      // { key:"musicindustry", value: "Music Industry", order: 15},
      // { key:"realeastate", value: "Real Estate", order: 16},
      // { key:"reunions", value: "Reunions", order: 17},
      // { key:"parents", value: "Parents", order: 18},
      // { key:"writing", value: "Writing", order: 19},
    ]

    topics.forEach(topic =>  {
      Topics.upsert({ _id: topic.key }, { $set: {
        displayName: topic.value,
        order: topic.order,
        followers: [],
        numPosts: Posts.find({ isDM: { $ne: true }, topicIds: topic._id }).count()
      }});
    })
  },
});

Migrations.add({
  version: 2,
  name: 'Adds tigerbot to the prepopulated data',
  up: function() {
    Users.upsert('system', { $set: {
      avatar: {
        url: '/images/tigerbot.png',
      },
      username: 'tigerbot',
      firstName: 'Tigerbot',
      lastName: '',
    }})
  },
})

Migrations.add({
  version: 3,
  name: 'Add source for existing messages',
  up: function() {
    Messages.find().forEach(message => {
      if (!message.source) {
        Messages.update(message._id, { $set: {
          source: 'web'
        }})
      }
    })
  },
})

Migrations.add({
  version: 4,
  name: 'Add description to topics',
  up: function() {
    Topics.find().forEach(topic => {
      if (!topic.description) {
        Topics.update(topic._id, { $set: {
          description: 'This topic needs a description.'
        }})
      }
    })
  },
})

Migrations.add({
  version: 5,
  name: 'Add isFullMember field to users',
  up: function() {
    Users.find().forEach(user => {
      if (user.isFullMember == undefined) {
        Users.update(user._id, { $set: {
          isFullMember: true
        }})
      }
    })
  },
})

Migrations.add({
  version: 6,
  name: 'Every princeton shield avatar is changed to a different default one',
  up: function() {
    Users.find().forEach(user => {
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
  },
})
