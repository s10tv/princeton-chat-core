var ERRORS_KEY = 'joinErrors';
var TOPICSIFOLLOW_KEY = 'topicsIFollow';

Template.signupTopics.onCreated(function() {
  Session.set(ERRORS_KEY, {});

  this.autorun(function() {
    if (Meteor.userId()) {
      const user = Meteor.user();
      Session.set(TOPICSIFOLLOW_KEY, user.followingTopics);
    }
  });
});

Template.signupTopics.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  // errorClass: function(key) {
  //   return Session.get(ERRORS_KEY)[key] && 'error';
  // },

  topicsForHeader: function(topicHeader) {
    const sections = [];

    var lists = Lists.find({ _id: {
      $in: topicHeader.topicIds
    }}).fetch();
    while (lists.length > 0) {
      sections.push(lists.splice(0, 2));
    }

    return sections;
  },

  isTopicFollowed: function(section, indexOfTopic) {
    var followingTopics = Session.get(TOPICSIFOLLOW_KEY);
    return _.contains(followingTopics, section[indexOfTopic]._id);
  },

  topicNameForSection: function(section, indexOfTopic) {
    return section[indexOfTopic].displayName;
  },

  topicIdForSection: function(section, indexOfTopic) {
    return section[indexOfTopic]._id;
  }
});

Template.signupTopics.events({
  'submit': function(event, template) {
    event.preventDefault();

    var errors = {};
    var checkedTopicIds = $(event.target).find('input[name="checked"]:checked').map(function() {
      return $(this).data('topicid');
    }).get();

    if (checkedTopicIds.length < 3) {
      errors.topics = 'Please follow at least 3 topics.';
    }

    Session.set(ERRORS_KEY, errors);
    if (_.keys(errors).length) {
      return;
    }

    console.log(checkedTopicIds);

    Meteor.call('topics/follow', checkedTopicIds, function(err) {
      if (err) {
        return Session.set(ERRORS_KEY, { 'none': err.reason });
      }

      Router.go('signupUsername');
    });
  }
});
