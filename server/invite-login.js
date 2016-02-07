Accounts.registerLoginHandler('invite', (serviceData) => {
  if (!serviceData.invite) {
    return undefined;
  }
  console.log('invite code: ', serviceData.invite);

  user = Users.findOne({ inviteCode: serviceData.invite })
  if (user) {
    console.log('found user')
    console.log(user)

    Accounts.setPassword(user._id, serviceData.invite);
    return {
      userId: user._id,
    }
  }

  return undefined;
});
