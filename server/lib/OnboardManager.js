import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { check } from 'meteor/check'
import { Invites } from '/lib/collections'
import { validator as validateNonAlumni } from '/lib/validation/request-invite-validation'
import { validator as validateAlumni } from '/lib/validation/home-validation'

const slackUrl = process.env.SLACK_URL || 'https://hooks.slack.com/services/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'
const slackUsername = process.env.ENV || 'dev'
const slackEmoji = process.env.ENV === 'prod' ? ':beer:' : ':poop:'
const slack = Meteor.npmRequire('slack-notify')(slackUrl)

export default class OnboardManager {

  verifyAlumni (options) {
    const errors = validateAlumni(options)
    if (errors.length > 0) {
      throw new Meteor.Error(400, errors)
    }

    const { netid, domain } = options
    const invite = {
      email: `${netid}@${domain}`,
      inviteCode: Random.id(),
      status: 'sent'
    }

    Invites.insert(invite)
    this.__sendEmailInvite(invite)

    return invite.inviteCode
  }

  verifyAffiliation (options) {
    const errors = validateNonAlumni(options)
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

  __sendEmailInvite ({ email, inviteCode }) {
    check(email, String)
    check(inviteCode, String)

    const inviteUrl = `${this.__stripTrailingSlash(process.env.ROOT_URL)}/invite/${inviteCode}`
    const postmark = Meteor.npmRequire('postmark')
    const postmarkKey = process.env.POSTMARK_API_KEY || 'a7c4668c-6430-4333-b303-38a4b9fe7426'
    const client = new postmark.Client(postmarkKey)

    const Future = Meteor.npmRequire('fibers/future')
    const future = new Future()
    const onComplete = future.resolver()

    client.sendEmailWithTemplate({
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
