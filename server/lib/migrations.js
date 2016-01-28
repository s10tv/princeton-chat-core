import {Topics, TopicHeaders} from '/imports/configs/collections';

Migrations.add({
  version: 1,
  name: 'Adds default topics to the DB',
  up: function() {

    const topics = [
      { key:"software", value: "Software", order: 1},
      { key:"product", value: "Product", order: 2},
      { key:"marketing", value: "Marketing", order: 3},
      { key:"artanddesign", value: "Arts & Design", order: 4},
      { key:"nonprofit", value: "Nonprofit", order: 5},
      { key:"fundraising", value: "Fundraising", order: 6},
      { key:"healthcare", value: "Healthcare", order: 7},
      { key:"finance", value: "Finance", order: 8},
      { key:"management", value: "Management", order: 9},
      { key:"legal", value: "Legal", order: 10},
      { key:"hardware", value: "Hardware", order: 11},
      { key:"science", value: "Science", order: 12},
      { key:"education", value: "Education", order: 13},
      { key:"hollywood", value: "Hollywood", order: 14},
      { key:"musicindustry", value: "Music Industry", order: 15},
      { key:"realeastate", value: "Real Estate", order: 16},
      { key:"reunions", value: "Reunions", order: 17},
      { key:"parents", value: "Parents", order: 18},
      { key:"writing", value: "Writing", order: 19},
    ]

    topics.forEach(topic =>  {
      Topics.upsert({ _id: topic.key }, { $set: {
        displayName: topic.value,
        order: topic.order,
      }});
    })

    const keys = topics.map((topic) => {
      return topic.key;
    })

    TopicHeaders.upsert({ _id: 'topics'}, { $set: {
      topicHeader: 'Topics',
      topicIds: keys,
      order: 2,
    }})
  },
});

Migrations.add({
  version: 2,
  name: 'Adds default regions to the DB.',
  up: function() {

    const regions = [
      { key:"bayarea", value: "SF Bay Area", order: 20},
      { key:"newyork", value: "New York", order: 25},
    ]

    regions.forEach(region => {
      Topics.upsert({ _id: region.key }, { $set: {
        displayName: region.value,
        order: region.order,
      }});
    })

    const keys = regions.map((region) => {
      return region.key;
    })

    TopicHeaders.upsert({ _id: 'regions'}, { $set: {
      topicHeader: 'Regions',
      topicIds: keys,
      order: 1,
    }})
  },
});

Migrations.add({
  version: 3,
  name: 'Adds followers, numPosts to the topics.',
  up: function() {
    Topics.find().map(topic => {
      Topics.update(topic._id, { $set: {
        followers: [],
        numPosts: Posts.find({ topicIds: topic._id }).count(),
      }})
    })
  },
});


Migrations.add({
  version: 4,
  name: 'Adds tigerbot to the prepopulated data',
  up: function() {
    Users.upsert('system', { $set: {
      avatar: {
        url: '/images/tigerbot.png',
      },
      username: 'tigerbot',
      firstName: 'Tiger',
      lastName: 'Bot',
    }})
  },
})
