import React from 'react'
import ReactDOMServer from '../../node_modules/react-dom/server'
import { check } from 'meteor/check'
import { Invites, Users } from '/lib/collections'
import { autoVerifyValidator, manualVerifyValidator } from '/lib/validation/onboarding'
import { princeton } from '/lib/validation'

import {
  htmlEmail,
  Signup,
  Invite,
  InviteNonAlum,
  emailTitle
} from '../emails'

const slackUrl = process.env.SLACK_URL || 'https://hooks.slack.com/services/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'
const slackUsername = process.env.ENV || 'dev'
const slackEmoji = process.env.ENV === 'prod' ? ':beer:' : ':poop:'
const slack = Meteor.npmRequire('slack-notify')(slackUrl)

export default class OnboardManager {

  constructor({ Meteor, Accounts, Email, Random, Collections, }) {
    this.audience = emailTitle || 'Princeton.Chat'
    this.Meteor = Meteor
    this.Accounts = Accounts
    this.Email = Email
    this.Random = Random
    this.Collections = Collections
  }

  verifyAlumni (options) {
    const errors = autoVerifyValidator(options)
    if (errors.length > 0) {
      throw new Meteor.Error(400, errors)
    }

    const { netid, domain, classYear } = options
    const invite = this.__generateInvite({email: `${netid}@${domain}`, status: 'sent', classYear: classYear})
    this.__sendSignupEmail({ email: invite.email, inviteCode: invite.inviteCode })

    return invite.inviteCode
  }

  verifyAffiliation (options) {
    const errors = manualVerifyValidator(options)
    if (errors.length > 0) {
      throw new Meteor.Error(400, errors)
    }

    options.status = 'pending'
    const inviteCode = this.__generateInvite(options)

    slack.send({
      icon_emoji: slackEmoji,
      text: `Need Manual Verify: ${options.firstName} ${options.lastName} [${options.email}]`,
      username: slackUsername
    })

    return inviteCode
  }

  handleInvites (user, invitees) {
    invitees.forEach(({ email, firstName, lastName }) => {
      if (!email) {
        return
      }
      // pass validation
      if (princeton(email) === undefined) {
        const existingUser = Accounts.findUserByEmail(email)
        if (!existingUser) {
          this.__sendAffiliatedInviteEmail({ email, firstName, lastName, sender: user })
        }
      } else {
        this.__sendNonAffiliatedInviteEmail({
          email,
          firstName,
          lastName,
          sender: user
        })
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

  handleManualVerify(invite) {
    this.__sendSignupEmail({ email: invite.email, inviteCode: invite.inviteCode })
    Invites.update(invite._id, { $set: { status: 'sent' }})
  }

  __sendAffiliatedInviteEmail ({ sender, email, firstName, lastName }) {
    const subject = `[${this.audience}] Invite from ${sender.firstName}`
    const invite = this.__generateInvite({email, referredBy: sender._id, status: 'sent'})
    const inviteUrl = `${this.__stripTrailingSlash(process.env.ROOT_URL)}/invite/${invite.inviteCode}`

    Email.send({
      from: process.env.POSTMARK_SENDER_SIG || process.env.INVITE_SENDER_SIG || 'notifications@princeton.chat',
      to: email,
      subject: subject,
      html: htmlEmail({
        title: subject,
        body: ReactDOMServer.renderToStaticMarkup(
          React.createElement(Invite, {
            // TODO: firstName and/or lastName could be undefined (if user logged in with FB)
            senderName: `${sender.firstName} ${sender.lastName}`,
            firstName,
            lastName,
            inviteUrl
          })
        )
      })
    })

    if (process.env.MAIL_URL) {
      slack.send({
        icon_emoji: ':mailbox:',
        text: `Sent alum-invite welcome email to ${email}.`,
        username: slackUsername
      })
    }
  }

  __sendNonAffiliatedInviteEmail ({ sender, email, firstName, lastName }) {
    const subject = `[${this.audience}] Invite from ${sender.firstName}`
    this.__generateInvite({email, referredBy: sender._id, status: 'pending-onboard'})

    Email.send({
      from: process.env.POSTMARK_SENDER_SIG || process.env.INVITE_SENDER_SIG || 'notifications@princeton.chat',
      to: email,
      subject: subject,
      html: htmlEmail({
        title: subject,
        body: ReactDOMServer.renderToStaticMarkup(
          React.createElement(InviteNonAlum, {
            firstName,
            lastName,
            rootURL: this.__stripTrailingSlash(process.env.ROOT_URL)
          })
        )
      })
    })

    if (process.env.MAIL_URL) {
      slack.send({
        icon_emoji: ':alien:',
        text: `Sent non-alum-invite welcome email to ${email}.`,
        username: slackUsername
      })
    }
  }

  __sendSignupEmail({ email, inviteCode }) {
    const inviteLink = `${this.__stripTrailingSlash(process.env.ROOT_URL)}/invite/${inviteCode}`
    const subject = process.env.INVITE_EMAIL_SUBJECT || `[${this.audience}] Welcome!`

    Email.send({
      from: process.env.POSTMARK_SENDER_SIG || process.env.INVITE_SENDER_SIG || 'notifications@princeton.chat',
      to: email,
      subject: subject,
      html: htmlEmail({
        title: subject,
        body: ReactDOMServer.renderToStaticMarkup(
          React.createElement(Signup, {
            inviteLink: inviteLink
          })
        )
      })
    })

    if (process.env.MAIL_URL) {
      slack.send({
        icon_emoji: ':mortar_board:',
        text: `Sent a signup welcome email to ${email}.`,
        username: slackUsername
      })
    }
  }

  __generateInvite ({
      email,
      firstName,
      lastName,
      birthDate,
      classYear,
      degree,
      referredBy,
      desc,
      status='pending' }) {

    const invite = {
      email,
      firstName,
      lastName,
      birthDate,
      classYear,
      desc,
      degree
    }

    const existingInvite = Invites.findOne({ email: email })
    if (existingInvite) {

      // update any info, in case anything changed
      Invites.update(existingInvite._id, { $set: invite })

      // return the updated invite
      return Invites.findOne(existingInvite._id)
    }

    invite.inviteCode = Random.id()
    invite.status = status
    invite.referredBy = referredBy

    Invites.insert(invite)

    return invite
  }

  __stripTrailingSlash (str) {
    if (str.substr(-1) === '/') {
      return str.substr(0, str.length - 1)
    }
    return str
  }
}
