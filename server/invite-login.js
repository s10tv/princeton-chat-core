import {Meteor} from 'meteor/meteor'
import {Accounts} from 'meteor/accounts-base'
import {Users, Invites} from '/lib/collections'
import AvatarService from '/lib/avatar.service'
import { audience } from './api'

Accounts.registerLoginHandler('invite', (serviceData) => {
  if (!serviceData.invite) {
    return undefined
  }
  console.log('invite code: ', serviceData.invite)

  const invite = Invites.findOne({ inviteCode: serviceData.invite })
  if (invite) {
    if (invite.status !== 'sent') {
      throw new Meteor.Error(401, 'Invite code invalid.')
    }

    const userId = Users.insert({
      avatar: {
        url: AvatarService.generateDefaultAvatarForAudience(audience),
        isDefaultAvatar: true,
        color: AvatarService.generateRandomColorForDefaultAvatar()
      },
      firstName: invite.firstName,
      lastName: invite.lastName,
      classYear: invite.classYear
    })

    Accounts.setPassword(userId, serviceData.invite)
    return { userId }
  }

  console.log('cannot find invite')
  return undefined
})
