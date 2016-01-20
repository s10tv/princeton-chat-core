Accounts.registerLoginHandler('invite', (serviceData) => {
  console.log('triggering invite handler');

  if (!serviceData.invite) {
    return undefined;
  }

  user = Users.findOne({ inviteCode: serviceData.invite })
  if (user) {
    return {
      userId: user._id,
    }
  }

  return undefined;
});
