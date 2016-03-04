import { isValidHash } from 'server/lib/Auth'

export default function (context) {
  const {Accounts, Collections} = context
  const {Users} = Collections

  Accounts.registerLoginHandler('guest', (serviceData) => {
    if (!serviceData.guest) {
      return undefined
    }

    const user = Users.findOne(serviceData.guest.userId)
    if (user && isValidHash(user, serviceData.guest.hash)) {
      return {
        userId: user._id
      }
    }

    return undefined
  })
}
