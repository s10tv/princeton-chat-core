import {Meteor} from 'meteor/meteor'
import {Accounts} from 'meteor/accounts-base'
import {Users, Invites} from '/lib/collections'
import AvatarService from '/lib/avatar.service'
import { audience } from './config'

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

    let existingUser = Accounts.findUserByEmail(invite.email)
    if (existingUser) {
      return { userId: existingUser._id }
    }

    const userId = Users.insert({
      avatar: {
        url: AvatarService.generateDefaultAvatarForAudience(audience),
        isDefaultAvatar: true,
        color: AvatarService.generateRandomColorForDefaultAvatar()
      },
      inviteCode: invite.inviteCode,
      firstName: invite.firstName,
      lastName: invite.lastName,
      classYear: invite.classYear
    })

    Accounts.addEmail(userId, invite.email)
    Accounts.setPassword(userId, invite.inviteCode)

    return { userId }
  }

  console.log('cannot find invite')
  return undefined
})
