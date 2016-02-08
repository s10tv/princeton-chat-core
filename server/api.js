import { Topics, Posts, Users, Messages } from '/imports/configs/collections';
import TopicManager from '/imports/server/TopicManager';
import PostManager from '/imports/server/PostManager';
import _ from 'underscore';

const slackUrl = process.env.SLACK_URL || 'https://hooks.slack.com/services/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'
const slackUsername = process.env.ENV || 'dev';
const slackEmoji = process.env.ENV == 'prod' ? ':beer:' : ':poop:';
const slack = Meteor.npmRequire('slack-notify')(slackUrl);

class CurrentUser {
  static get() {
    user = Meteor.user();
    if (!user) {
      throw new Meteor.Error(401, 'Unauthorized');
    }
    return user;
  }
}

class UsernameGenerator {
  static generate(user) {
    if (user.emails.length > 0) {
      const [ email ] = user.emails;
      return email.address.substring(0, email.address.indexOf('@'));
    } else if (user.firstName && user.lastName) {
      return `${user.firstName.toLowerCase()}.${user.lastName.toLowerCase()}`;
    } else if (user.firstName) {
      return `${user.firstName.toLowerCase()}`;
    } else {
      return Meteor.uuid();
    }
  }
}

getLargestUserNumber = () => {
  const [ userWithHighestNumber ] = Users
    .find({}, { sort: { userNumber: 1 }, limit: 1 })
    .fetch();

  if (userWithHighestNumber && userWithHighestNumber.userNumber) {
    return userWithHighestNumber.userNumber + 1;
  } else {
    return 1;
  }
}

stripTrailingSlash = (str) => {
  if(str.substr(-1) === '/') {
      return str.substr(0, str.length - 1);
  }
  return str;
}

Meteor.methods({
  'signup': (options) => {
    check(options, Object);
    const { firstName, lastName, classYear, emailAddress } = options;

    check(firstName, String);
    check(lastName, String);
    check(classYear, String);
    check(emailAddress, String);

    var email = (emailAddress || "").trim();
    if (email.length == 0) {
      throw new Meteor.Error(400, 'To sign up, you need to enter your email.');
    }

    var user = Accounts.findUserByEmail(email);
    if (!user) {
      // our onboarding using react has a field called `email` on user, instead of meteor `emails`
      user = Users.findOne({ email: email });
    }

    if (!user) {
      var userNumber = getLargestUserNumber();
      const userId = Users.insert({
        firstName,
        lastName,
        classYear,
        userNumber: userNumber,
        status: 'pending',
      })

      Accounts.addEmail(userId, email);
      user = Users.findOne(userId);
    }

    const inviteCode = Random.id();
    Users.update(user._id, { $set: {
      inviteCode: inviteCode
    }})

    slack.send({
      icon_emoji: slackEmoji,
      text: `${user.firstName} ${user.lastName} (${email}) signed up`,
      username: slackUsername,
    })

    if (process.env.SKIP_CHECK_PRINCETON_EMAIL || /.*@alumni.princeton.edu$/.test(email)) {
      const inviteUrl = `${stripTrailingSlash(process.env.ROOT_URL)}/invite/${inviteCode}`;
      const postmark = Meteor.npmRequire("postmark");
      const postmarkKey = process.env.POSTMARK_API_KEY || 'a7c4668c-6430-4333-b303-38a4b9fe7426';
      const client = new postmark.Client(postmarkKey);

      const Future = Npm.require('fibers/future')
      const future = new Future()
      const onComplete = future.resolver()

      client.sendEmailWithTemplate({
        "From": "notifications@princeton.chat",
        "To": email,
        "TemplateId": process.env.POSTMARK_WELCOME_TEMPLATE_ID || 354341,
        "TemplateModel": {
          inviteLink: inviteUrl
        }
      }, onComplete)

      Future.wait(future)
      try {
        future.get();
      } catch (err) {
        console.error(err);
        console.log(err.stack);
        return;
      }

      slack.send({
        icon_emoji: slackEmoji,
        text: `Sent a welcome email to ${email}.`,
        username: slackUsername,
      })

      return true;
    }

    // did not pass validation.
    return false;
  },

  'topics/users/import': (topicId, userInfos) => {
    check(topicId, String);
    check(userInfos, [Object]);

    const topic = Topics.findOne(topicId);
    if (!topic) {
      throw new Meteor.Error(400, `Invalid topicId: ${topicId}.`);
    }

    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const filteredUserInfos = userInfos.filter(userInfo => re.test(userInfo.email))

    const groupedUserInfos = _.groupBy(filteredUserInfos, (userInfo) => userInfo.email);
    var hasDuplicateEmails = false;
    _.each(groupedUserInfos, (userInfosArr, key) => {
      if (userInfosArr.length > 1) {
        hasDuplicateEmails = key;
      }
    });

    if (hasDuplicateEmails) {
      throw new Meteor.Error(500, `You typed the same email ${hasDuplicateEmails} more than once, please check.`)
    }

    try {
      filteredUserInfos.forEach(userInfo => {
        const email = userInfo.email;
        const firstName = userInfo.firstName || '';
        const lastName = userInfo.lastName || '';
        let existingUser = Accounts.findUserByEmail(email);
        if (!existingUser) {
          // assign the user a username equal to their email username
          let username = email.substring(0, email.indexOf('@'));
          let newUserId = Accounts.createUser({ username, email, password: email, profile: {} });

          Users.update(newUserId, { $set: {
            firstName,
            lastName,
            username,
            isFullMember: false
          }});

          existingUser = Users.findOne(newUserId);
        }

        TopicManager.follow({ topicId, user: existingUser });
      })
    } catch(e) {
      throw new Meteor.Error(500, "Sorry, we messed up. We couldn't add your followers, but we tried very hard :/")
    }
  },

  'signup/test': (emailOverride) => {
    check(emailOverride, Match.Optional(String))
    const [{user}] = JSON.parse(HTTP.call("GET", "https://randomuser.me/api/").content).results;
    const email = emailOverride || user.email;

    Meteor.call('signup', {
      firstName: user.name.first,
      lastName: user.name.last,
      classYear: '2012',
      emailAddress: email,
    });
  },

  'signup/randomuser': () => {
    const [{user}] = JSON.parse(HTTP.call("GET", "https://randomuser.me/api/").content).results;
    const inviteCode = Meteor.uuid()
    Users.insert({
      firstName: user.name.first,
      lastName: user.name.last,
      emails: [
        { address: user.email, verified: false }
      ],
      classYear: "2012",
      inviteCode: inviteCode,
    })

    console.log(`http://localhost:3000/invite/${inviteCode}`);
  },

  'topics/follow': (topicIds) => {
    const user = CurrentUser.get();

    const curatedTopicIds = topicIds.map(topicId => {
      return Topics.findOne(topicId);
    }).filter(topic => {
      return topic != undefined && topic != null;
    }).map(topic => {
      return topic._id;
    })

    Users.update(user._id, { $set: {
      followingTopics: curatedTopicIds,
    }})
  },

  'profile/update': (profile) => {
    const user = CurrentUser.get();

    check(profile, Object);
    check(profile.firstName, String);
    check(profile.lastName, String);
    check(profile.classYear, Number);
    check(profile.username, String);
    check(profile.avatarUrl, String);

    Users.update(user._id, {
      $set: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        classYear: profile.classYear,
        username: profile.username,
        avatar: {
          url: profile.avatarUrl
        },
      }
    });
  },

  'emailPreference/update': (preference) => {
    user = CurrentUser.get()
    Users.update(user._id, { $set: {
      emailPreference: preference
    }})
  },

  'post/insert': (_id, title, content, topicIds) => {
    user = CurrentUser.get()

    check(_id, String);
    check(title, String);
    check(content, String);
    check(topicIds, [String]);

    try {
      title = title.trim();
      content = content.trim();
    } catch (e) {
      throw new Meteor.Error(400, 'Every post needs to have a title and content.');
    }

    if (title.length == 0 || content.length == 0) {
      throw new Meteor.Error(400, 'Every post needs to have a title and content.');
    }

    // make sure that the topic ids entered are legit;
    const filteredTopicIds = topicIds.filter(topicId => {
      return Topics.findOne(topicId) != undefined
    })

    if (filteredTopicIds.length == 0) {
      throw new Meteor.Error(400, 'Please enter at least one valid topicId.');
    }

    // We are good to insert the post.
    const postId = Posts.insert({
      _id,
      title,
      content,
      ownerId: user._id,
      topicIds: filteredTopicIds,
      followers: [{
        userId: user._id,
        unreadCount: 0,
      }],
      numMsgs: 0,
    })

    // The current user follows the current post they just posted
    Meteor.call('post/follow', postId);

    // update the num posts after posting.
    filteredTopicIds.forEach(topicId => {
      Topics.update(topicId, { $set: {
        numPosts: Posts.find({ isDM: { $ne: true }, topicIds: topicId}).count()
      }});
    })

    if (process.env.IRON_MQ_TOKEN && process.env.IRON_MQ_PROJECT_ID) {
      new IronMQ('web-post').send({
        payload: { postId }
      })
    }
  },

  'topic/follow': (topicId) => {
    check(topicId, String);

    try {
      TopicManager.follow({ topicId, user: CurrentUser.get()})
    } catch(err) {
      throw new Meteor.Error(500, 'There was a problem with following this topic.');
    }
  },

  'topic/unfollow': (topicId) => {
    check(topicId, String);

    try {
      TopicManager.unfollow({ topicId, user: CurrentUser.get()})
    } catch(err) {
      throw new Meteor.Error(500, 'There was a problem with unfollowing this topic.');
    }
  },

  'post/follow': (postId) => {
    check(postId, String);
    PostManager.follow({ postId, user: CurrentUser.get()})
  },

  'post/unfollow': (postId) => {
    check(postId, String);
    PostManager.unfollow({ postId, user: CurrentUser.get()})
  },

  'messages/insert': (_id, postId, commentText) => {
    check(_id, String);
    check(postId, String);
    check(commentText, String);

    const user = CurrentUser.get();
    Messages.insert({
      _id,
      postId,
      content: commentText,
      ownerId: user._id,
    })

    if (process.env.IRON_MQ_TOKEN && process.env.IRON_MQ_PROJECT_ID) {
      new IronMQ('web-message').send({
        payload: { messageId: _id }
      })
    }

    Posts.update(postId, { $inc: { numMsgs: 1 }});
  },

  //onboarding related
  '_accounts/unlink/service': function (serviceName) {
    const user = CurrentUser.get();
    Accounts.unlinkService(user._id, serviceName);
  },

  'welcome/setLoginService': (serviceName) => {
    check(serviceName, String);

    try {
      const user = CurrentUser.get();
      Users.update(user._id, { $set: {
        username: UsernameGenerator.generate(user),
        emailPreference: 'all', // have this in here until users can choose their email prefs in onboarding.
        avatar: {
          url: '/images/princeton.svg'
        },
        status: 'active',
      }})
    } catch(error) {
      console.error(error);
      throw new Meteor.Error(500, `There was a problem setting up your ${serviceName}`);
    }
  },

  'get/followers': (userIds) => {
    check(userIds, Array);

    return userIds.map(user => {
      return Users.findOne(user.userId);
    }).filter((user) => user != undefined);
  }
})
