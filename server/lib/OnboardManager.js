import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Random } from 'meteor/random'
import { check } from 'meteor/check'
import { Invites, Users } from '/lib/collections'
import { autoAffiliationValidator, manualAffiliationValidator } from '/lib/validation/onboarding'
import { princeton } from '/lib/validation'

const slackUrl = process.env.SLACK_URL || 'https://hooks.slack.com/services/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'
const slackUsername = process.env.ENV || 'dev'
const slackEmoji = process.env.ENV === 'prod' ? ':beer:' : ':poop:'
const slack = Meteor.npmRequire('slack-notify')(slackUrl)

export default class OnboardManager {

  constructor () {
    const postmark = Meteor.npmRequire('postmark')
    this.postmarkKey = process.env.POSTMARK_API_KEY || ''
    if (this.postmarkKey.length > 0) {
      this.postmarkClient = new postmark.Client(postmarkKey)
    }
  }

  verifyAlumni (options) {
    const errors = autoAffiliationValidator(options)
    if (errors.length > 0) {
      throw new Meteor.Error(400, errors)
    }

    const { netid, domain } = options
    return this.__generateInviteForPrincetonAlum({email: `${netid}@${domain}`})
  }

  verifyAffiliation (options) {
    const errors = manualAffiliationValidator(options)
    if (errors.length > 0) {
      throw new Meteor.Error(400, errors)
    }

    const invite = Object.assign(options, {
      inviteCode: Random.id()
    })

    Invites.insert(invite)

    slack.send({
      icon_emoji: slackEmoji,
      text: `Unaffiliated: ${options.firstName} ${options.lastName} signed up at ${options.email}`,
      username: slackUsername
    })

    return invite.inviteCode
  }

  handleInvites (invitees) {
    invitees.forEach(({ email, firstName, lastName }) => {
      if (!email) {
        return
      }
      // pass validation
      if (princeton(email) === undefined) {
        const existingUser = Accounts.findUserByEmail(email)
        if (!existingUser) {
          this.__sendAlumInviteEmail({ email, firstName, lastName })
        }
      } else {
        this.__sendNonPrincetonAlumInviteEmail({ email, firstName, lastName })
      }
    })
  }

  handleSignup (user, { firstName, lastName, password, email }) {
    Users.update(user._id, { $set: {
      firstName: user.firstName || firstName,
      lastName: user.lastName || lastName
    }})

    Accounts.addEmail(user._id, email)
    Accounts.setPassword(user._id, password, { logout: false })
  }

  __sendAlumInviteEmail ({ email, firstName, lastName }) {
    console.log('sending alum invite email to ' + email)
  }

  __sendNonPrincetonAlumInviteEmail ({ email, firstName, lastName }) {
    console.log('sending non-alum invite email to ' + email)
  }

  __generateInviteForPrincetonAlum ({ email }) {
    const invite = {
      email,
      inviteCode: Random.id(),
      status: 'sent'
    }

    Invites.insert(invite)
    this.__sendEmailInvite(invite)

    return invite.inviteCode
  }

  __sendEmailInvite ({ email, inviteCode }) {
    check(email, String)
    check(inviteCode, String)

    const inviteUrl = `${this.__stripTrailingSlash(process.env.ROOT_URL)}/invite/${inviteCode}`
    if (this.postmarkKey.length === 0) {
      return console.log(`[Dev] Would have sent invite link ${inviteUrl} to ${email}`)
    }

    const Future = Meteor.npmRequire('fibers/future')
    const future = new Future()
    const onComplete = future.resolver()

    this.postmarkClient.sendEmailWithTemplate({
      'From': process.env.POSTMARK_SENDER_SIG || 'notifications@princeton.chat',
      'To': email,
      'TemplateId': process.env.POSTMARK_WELCOME_TEMPLATE_ID || 354341,
      'TemplateModel': {
        inviteLink: inviteUrl
      }
    }, onComplete)

    Future.wait(future)
    try {
      future.get()
    } catch (err) {
      console.log('Received error from Postmark. Perhaps templateId or sender sig is wrong?')
      console.log(err.stack)
      return
    }

    slack.send({
      icon_emoji: slackEmoji,
      text: `Sent a welcome email to ${email}.`,
      username: slackUsername
    })
  }

  __stripTrailingSlash (str) {
    if (str.substr(-1) === '/') {
      return str.substr(0, str.length - 1)
    }
    return str
  }
}
