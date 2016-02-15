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
import EmailInvite from '../emails/invite.jsx'
import EmailNonAlumniInvite from '../emails/inviteNonAlum.jsx'

const slackUrl = process.env.SLACK_URL || 'https://hooks.slack.com/services/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'
const slackUsername = process.env.ENV || 'dev'
const slackEmoji = process.env.ENV === 'prod' ? ':beer:' : ':poop:'
const slack = Meteor.npmRequire('slack-notify')(slackUrl)

export default class OnboardManager {

  constructor() {
    this.audience = 'Princeton.Chat'
  }

  verifyAlumni (options) {
    const errors = autoVerifyValidator(options)
    if (errors.length > 0) {
      throw new Meteor.Error(400, errors)
    }

    const { netid, domain } = options
    const invite = this.__generateInvite({email: `${netid}@${domain}`, status: 'sent'})
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
      text: `Unaffiliated: ${options.firstName} ${options.lastName} signed up at ${options.email}`,
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
    Invites.update(invite._id, { $set: { status: 'sent' }})
    this.__sendSignupEmail({ email: invite.email, inviteCode: invite.inviteCode })
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
          React.createElement(EmailInvite, {
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
          React.createElement(EmailNonAlumniInvite, {
            firstName,
            lastName,
            rootURL: this.__stripTrailingSlash(process.env.ROOT_URL)
          })
        )
      })
    })

    if (process.env.MAIL_URL) {
      slack.send({
        icon_emoji: ':alien',
        text: `Sent non-alum-invite welcome email to ${email}.`,
        username: slackUsername
      })
    }
  }

  __sendSignupEmail({ email, inviteCode }) {
    const inviteLink = `${this.__stripTrailingSlash(process.env.ROOT_URL)}/invite/${inviteCode}`
    const subject = process.env.INVITE_EMAIL_SUBJECT || `[${this.audience}] hurrah, hurrah, hurrah. Almost there.`

    Email.send({
      from: process.env.POSTMARK_SENDER_SIG || process.env.INVITE_SENDER_SIG || 'notifications@princeton.chat',
      to: email,
      subject: subject,
      html: htmlEmail({
        title: subject,
        body: ReactDOMServer.renderToStaticMarkup(
          React.createElement(EmailSignup, {
            inviteLink: inviteLink
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
