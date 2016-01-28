Accounts.registerLoginHandler('invite', (serviceData) => {
  if (!serviceData.invite) {
    return undefined;
  }

  user = Users.findOne({ inviteCode: serviceData.invite })
  if (user) {
    Accounts.setPassword(user._id, serviceData.invite);

    if (!user.tigerbotPostId) {
      user.tigerbotPostId = Posts.insert({
        ownerId: 'system',
        content: 'Welcome to Princeton.chat!',
        followers: [
          { userId: user._id, unreadCount: 0 },
          { userId: 'system', unreadCount: 0 },
        ],
        isDM: true,
        numMsgs: 0,
      })

      Users.update(user._id, { $set: {
        tigerbotPostId: user.tigerbotPostId
      }});

      // send welcome message
      Messages.insert({
        senderId: 'system',
        ownerId: user._id,
        postId: user.tigerbotPostId,
        type: "welcome",
      })

      Meteor.call('welcome/triggerSelectTopicPrompt');
    }

    return {
      userId: user._id,
    }
  }

  return undefined;
});
