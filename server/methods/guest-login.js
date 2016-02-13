import { Accounts } from 'meteor/accounts-base'
import { Users } from '/lib/collections'
import { isValidHash } from '/server/lib/Auth'

export default function () {
  Accounts.registerLoginHandler('guest', (serviceData) => {
    if (!serviceData.guest) {
      return undefined
    }

    const user = Users.findOne(serviceData.guest.userId)
    if (isValidHash(user, serviceData.guest.hash)) {
      return {
        userId: user._id
      }
    }

    return undefined
  })
}