class CurrentUser {
  static get() {
    user = Meteor.user();
    if (!user) {
      throw new Meteor.Error(401, 'Unauthorized');
    }
    return user;
  }
}

// onboarding related
sendBase = (sender, content, type, qnum, resumeType) => {
  const user = CurrentUser.get();

  Messages.insert({
    senderId: sender,
    ownerId: user._id,
    type: type,
    content: content,
    qnum: qnum,
    resumeType: resumeType,
  })
}

systemSend = (type, qnum) => {
  return sendBase('system', undefined, type, qnum)
}

systemSendRaw = (content, qnum, resumeType) => {
  return sendBase('system', content, 'raw', qnum, resumeType)
}

send = (content) => {
  const user = CurrentUser.get();
  return sendBase(user._id, content, 'raw');
}

Meteor.methods({
  // TODO: for future versions
  // 'facebook/isActive': () => {
  //   user = CurrentUser.get();
  //   if (user.services.facebook) {
  //     return true;
  //   }
  //
  //   return false;
  // },
  //
  // 'instagram/isActive': () => {
  //   user = CurrentUser.get();
  //   if (user.services.instagram) {
  //     return true;
  //   }
  //
  //   return false;
  // },
  //
  // 'twitter/isActive': () => {
  //   user = CurrentUser.get();
  //   if (user.services.twitter) {
  //     return true;
  //   }
  //
  //   return false;
  // },

  'profile/update': (profile) => {
    user = CurrentUser.get();
    Users.update(user._id, {
      $set: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        info: profile.info,
        classYear: profile.classYear,
        classType: profile.classType
      }
    });
  },

  'emailPreference/update': (preference) => {
    user = CurrentUser.get()
    Users.update(user._id, { $set: {
      emailPreference: preference
    }})
  },

  'topic/follow': (listId) => {
    user = CurrentUser.get();
    Users.update(user._id, { $addToSet: {
      followingTopics: listId
    }})
  },

  'topic/unfollow': (listId) => {
    user = CurrentUser.get();
    Users.update(user._id, { $pull: {
      followingTopics: listId
    }})
  },

  'post/insert': (title, content, topicIds) => {
    user = CurrentUser.get()

    const fullTopics = topicIds.map(topicId => {
      return Lists.findOne(topicId);
    })

    return Todos.insert({
      title: title,
      content: content,
      ownerId: user._id,
      topics: fullTopics,
      listIds: topicIds,
    })
  },

  'comment/insert': (postId, commentText) => {
    check(postId, String);
    check(commentText, String);

    const user = CurrentUser.get();
    Comments.insert({
      postId,
      content: commentText,
      ownerId: user._id,
    })
  },

  //onboarding related
  '_accounts/unlink/service': function (serviceName) {
    const user = CurrentUser.get();
    Accounts.unlinkService(user._id, serviceName);
  },

  'reset': () => {
    const user = CurrentUser.get();
    Messages.remove({
      ownerId: user._id,
    });
    Messages.insert({
      senderId: 'system',
      ownerId: user._id,
      type: "welcome",
    })
  },

  'avatar/update': (serviceName) => {
    const user = CurrentUser.get();
    console.log('avatar/update', serviceName);

    if (Messages.find({ ownerId: user._id, qnum: 'avatar/update' }).count() > 0) {
      // the user has seen this already
      return;
    }

    var avatarUrl;
    switch(serviceName) {
      case 'facebook':
        avatarUrl = `https://graph.facebook.com/${user.services.facebook.id}/picture?type=large`;
      case 'instagram':
        avatarUrl = user.services.instagram.profile_picture;
    }

    systemSend('share', 'avatar/update')
    Users.update(user._id, {
      $set: {
        avatar: {
          url: avatarUrl
        }
      }
    });
    //  systemSend('thanks', 'avatar/update')
  },

  'share/skip': () => {
    systemSend('thanks', 'avatar/update')
  },

  'welcome/yes': () => {
    const user = CurrentUser.get();

    if (Messages.find({ ownerId: user._id, qnum: 'welcome/yes' }).count() > 0) {
      // the user has answered this question already;
      return;
    }

    if (Messages.find({ ownerId: user._id, senderId: 'system' }).count() > 1) {
      send('Actually, I changed my mind. Sign me up now.')
      systemSendRaw('Wonderful! Glad you changed your mind.')
    } else {
      send('Sure! Count me in.')
    }

    systemSendRaw('Welcome to the Princeton.chat community. Let\'s get you set up right away.')
    systemSend('firstname', 'welcome/yes')
  },

  'welcome/no': () => {
    const user = CurrentUser.get();

    if (Messages.find({ ownerId: user._id, qnum: { $in: ['welcome/yes', 'welcome/no']}}).count() == 0) {
      send('Not now. Remind me again in a bit')
      systemSendRaw('Alright then. We will follow up with you via email in the following weeks.', 'welcome/no')
    }
  },

  'message/add': (msg, type) => {
    const user = CurrentUser.get();

    const message = (msg || '').trim();

    if (message.length == 0) {
      return 0;
    }

    console.log(message, type);
    send(message)

    if (type) {
      switch(type) {
        // what is your first naem
        case 'firstname':
          Users.update(user._id, { $set: { firstName: message }});
          return systemSend('lastname');

        case 'lastname':
          Users.update(user._id, { $set: { lastName: message }});
          return systemSend('classyear');

        case 'classyear':
          const fourDigitRe = /^[0-9]{4}$/
          const shorthandRe = /^'[0-9]{2}$/
          if (message.match(fourDigitRe) != null || message.match(shorthandRe) != null) {

            var year;
            if (message.match(fourDigitRe) != null) {
              console.log(message.match(fourDigitRe))
              year = parseInt(message);
            } else {
              console.log(message.match(shorthandRe))
              const parsed = parseInt(message.substring(1));
              if (parsed > 30) {
                year = parseInt(`19${parsed}`)
              } else {
                year = parseInt(`20${parsed}`)
              }
            }

            Users.update(user._id, { $set: { classYear: `${year}`}});

            const yearAsNum = parseInt(year);
            const diff = 2016 - yearAsNum;
            if (diff < 5) {
              systemSendRaw(`Oh it's only been ${diff} years since you've graduated.`, 'classyear');
              return systemSend('classtype');
            } else {
              systemSendRaw(`Wow you've been out of princeton for ${diff} years already? Time flies.`, 'classyear');
              return systemSend('classtype');
            }
          } else {
            return systemSendRaw('Please enter your classyear as a 4 digit number, or using the shorthand i.e. \'12.', undefined, 'classyear');
          }

          break;

        case 'classtype':
          if (message.toLowerCase() == 'undergraduate' || message.toLowerCase() == 'undergrad' || message.toLowerCase() == 'u') {
            Users.update(user._id, { $set: { classType: 'undergrad' }});
            systemSendRaw(`Ah of course. I miss my undergrad days too`, 'classtype');
            return systemSend('linkservice');
          } else if (message.toLowerCase() == 'graduate' || message.toLowerCase() == 'grad' || message.toLowerCase() == 'g') {
            Users.update(user._id, { $set: { classType: 'grad' }});
            systemSendRaw(`Ah of course. I miss my grad school days too`, 'classtype');
            return systemSend('linkservice');
          } else {
            return systemSendRaw('Please enter \'U\' for undergrad and \'G\' for grad', undefined, 'classtype');
          }
      }
    }
  }
})
