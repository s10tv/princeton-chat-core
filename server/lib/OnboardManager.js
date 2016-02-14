import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Email } from 'meteor/email'
import { Random } from 'meteor/random'
import { check } from 'meteor/check'
import { Invites, Users } from '/lib/collections'
import { autoVerifyValidator, manualVerifyValidator } from '/lib/validation/onboarding'
import { princeton } from '/lib/validation'

import htmlEmail from '../emails/html.layout'
import EmailSignup from '../emails/signup.jsx'

const slackUrl = process.env.SLACK_URL || 'https://hooks.slack.com/services/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'
const slackUsername = process.env.ENV || 'dev'
const slackEmoji = process.env.ENV === 'prod' ? ':beer:' : ':poop:'
const slack = Meteor.npmRequire('slack-notify')(slackUrl)

export default class OnboardManager {

  verifyAlumni (options) {
    const errors = autoVerifyValidator(options)
    if (errors.length > 0) {
      throw new Meteor.Error(400, errors)
    }

    const { netid, domain } = options
    return this.__generateInviteForPrincetonAlum({email: `${netid}@${domain}`})
  }

  verifyAffiliation (options) {
    const errors = manualVerifyValidator(options)
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
    Email.send({
      from: process.env.POSTMARK_SENDER_SIG || process.env.INVITE_SENDER_SIG || 'notifications@princeton.chat',
      to: email,
      subject: process.env.INVITE_EMAIL_SUBJECT || '[Princeton.Chat] hurrah, hurrah, hurrah. Almost there.',
      html: htmlEmail({
        title: '[Princeton.Chat] hurrah, hurrah, hurrah. Almost there.',
        body: ReactDOMServer.renderToStaticMarkup(
          React.createElement(EmailSignup, {
            inviteLink: inviteUrl
          })
        )
      })
    })

    if (process.env.MAIL_URL) {
      slack.send({
        icon_emoji: slackEmoji,
        text: `Sent a welcome email to ${email}.`,
        username: slackUsername
      })
    }
  }

  __stripTrailingSlash (str) {
    if (str.substr(-1) === '/') {
      return str.substr(0, str.length - 1)
    }
    return str
  }
}
