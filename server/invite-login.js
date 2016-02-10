import {Accounts} from 'meteor/accounts-base'
import {Users} from '/imports/configs/collections'

Accounts.registerLoginHandler('invite', (serviceData) => {
  if (!serviceData.invite) {
    return undefined
  }
  console.log('invite code: ', serviceData.invite)

  const user = Users.findOne({ inviteCode: serviceData.invite })
  if (user) {
    console.log('found user', user)

    Accounts.setPassword(user._id, serviceData.invite)
    return {
      userId: user._id
    }
  }

  return undefined
})
