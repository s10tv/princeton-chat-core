import React from 'react'
import ReactDOMServer from '../../node_modules/react-dom/server'
import { autoVerifyValidator, manualVerifyValidator,
  enterNamesValidator } from '/lib/validation/onboarding'
import {isTest} from '/lib/test'
import { princeton } from '/lib/validation'

import { title } from '/imports/env'
import emails from '../emails'

const {
  htmlEmail,
  Signup,
  Invite,
  RecoverEmail,
  InviteNonAlum
} = emails

const slackUsername = process.env.ENV || 'dev'
const slackEmoji = process.env.ENV === 'prod' ? ':beer:' : ':poop:'

export default class OnboardManager {

  constructor ({ Meteor, Accounts, Email, Random, Collections, slack, rootURL, HTTP }) {
    this.audience = title || 'Princeton.Chat'
    this.Meteor = Meteor
    this.Accounts = Accounts
    this.Email = Email
    this.Random = Random
    this.Collections = Collections
    this.slack = slack
    this.rootURL = rootURL
    this.HTTP = HTTP
  }

  verifyAlumni (options) {
    const {Users} = this.Collections
    const errors = autoVerifyValidator()
    if (errors.length > 0) {
      throw new this.Meteor.Error(400, errors)
    }

    const { netid, domain, classYear } = options

    if (Users.findOne({emails: {$elemMatch: {address: `${netid}@${domain}`}}})) {
      throw new this.Meteor.Error(400, 'This email address is already used.')
    }

    var res

    // Not doing mailgun validation in testing mode
    if (!isTest()) {
      try {
        res = this.HTTP.get('https://api.mailgun.net/v3/address/validate', {
          auth: `api:${this.Meteor.settings.public.mailgunPublicKey}`,
          params: {
            address: `${netid}@${domain}`
          }
        })
      } catch (e) {
        console.error(e)
        throw new this.Meteor.Error(500, 'Sorry, an unknown error occurred.')
      }
    }

    if (isTest() || res.data['is_valid']) {
      const invite = this.__generateInvite({email: `${netid}@${domain}`, status: 'sent', classYear})
      this.__sendSignupEmail({ email: invite.email, inviteCode: invite.inviteCode })
    } else {
      throw new this.Meteor.Error(400, 'This email is invalid. Are you sure the one you entered is correct?')
    }
  }

  verifyAffiliation (options) {
    const {Users} = this.Collections
    const errors = manualVerifyValidator(options)
    if (errors.length > 0) {
      throw new this.Meteor.Error(400, errors)
    }

    if (Users.findOne({emails: {$elemMatch: {address: options.email}}})) {
      throw new this.Meteor.Error(400, 'This email address is already used.')
    }

    options.status = 'pending'
    const inviteCode = this.__generateInvite(options)

    this.slack.send({
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
        const existingUser = this.Accounts.findUserByEmail(email)
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

  handleEnterNames (user, options) {
    const {Users} = this.Collections
    const errors = enterNamesValidator(options)
    if (errors.length > 0) {
      throw new this.Meteor.Error(400, errors)
    }

    const { fullName } = options

    Users.update(user._id, { $set: {
      displayName: fullName
    }})
  }

  sendRecoveryEmail (email) {
    const user = this.Accounts.findUserByEmail(email)
    if (!user) {
      throw new this.Meteor.Error(400, 'No user was found with this email.')
    }
    const userId = user._id

    // TODO: move this somewhere else, so that it gets executed only once
    this.Accounts.emailTemplates.resetPassword.subject = (user) => {
      return 'Reset Password'
    }
    this.Accounts.emailTemplates.resetPassword.from = () => {
      return process.env.POSTMARK_SENDER_SIG || process.env.INVITE_SENDER_SIG || 'Princeton.Chat <notifications@princeton.chat>'
    }
    this.Accounts.emailTemplates.resetPassword.html = (user, url) => {
      const token = url.substring(url.lastIndexOf('/') + 1)
      const ourUrl = `${this.rootURL}/forgot-password/${token}`
      return ReactDOMServer.renderToStaticMarkup(
        React.createElement(RecoverEmail, {
          recoveryLink: ourUrl
        })
      )
    }

    if (!isTest) {
      return this.Accounts.sendResetPasswordEmail(userId, email)
    } else {
      console.log('Sent recovery email to ' + email)
      return null
    }
  }

  handleSignup (user, { firstName, lastName, password, email }) {
    const {Users} = this.Collections
    Users.update(user._id, { $set: {
      firstName: user.firstName || firstName,
      lastName: user.lastName || lastName
    }})

    this.Accounts.addEmail(user._id, email)
    this.Accounts.setPassword(user._id, password, { logout: false })
  }

  handleManualVerify (invite) {
    const {Invites} = this.Collections
    this.__sendSignupEmail({ email: invite.email, inviteCode: invite.inviteCode })
    Invites.update(invite._id, {$set: { status: 'sent' }})
  }

  __sendAffiliatedInviteEmail ({ sender, email, firstName, lastName }) {
    const subject = `[${this.audience}] Invite from ${sender.firstName}`
    const invite = this.__generateInvite({email, referredBy: sender._id, status: 'sent'})
    const inviteUrl = `${this.rootURL}/invite/${invite.inviteCode}`

    this.Email.send({
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
      this.slack.send({
        icon_emoji: ':mailbox:',
        text: `Sent alum-invite welcome email to ${email}.`,
        username: slackUsername
      })
    }
  }

  __sendNonAffiliatedInviteEmail ({ sender, email, firstName, lastName }) {
    const subject = `[${this.audience}] Invite from ${sender.firstName}`
    this.__generateInvite({email, referredBy: sender._id, status: 'pending-onboard'})

    this.Email.send({
      from: process.env.POSTMARK_SENDER_SIG || process.env.INVITE_SENDER_SIG || 'notifications@princeton.chat',
      to: email,
      subject: subject,
      html: htmlEmail({
        title: subject,
        body: ReactDOMServer.renderToStaticMarkup(
          React.createElement(InviteNonAlum, {
            firstName,
            lastName,
            rootURL: this.rootURL
          })
        )
      })
    })

    if (process.env.MAIL_URL) {
      this.slack.send({
        icon_emoji: ':alien:',
        text: `Sent non-alum-invite welcome email to ${email}.`,
        username: slackUsername
      })
    }
  }

  __sendSignupEmail ({ email, inviteCode }) {
    const inviteLink = `${this.rootURL}/invite/${inviteCode}`
    const subject = process.env.INVITE_EMAIL_SUBJECT || `[${this.audience}] Welcome!`

    this.Email.send({
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
      this.slack.send({
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
      status = 'pending' }) {
    const {Invites} = this.Collections
    const invite = {
      email,
      firstName,
      lastName,
      birthDate,
      classYear,
      desc,
      degree,
      status
    }

    const existingInvite = Invites.findOne({ email: email })
    if (existingInvite) {
      // update any info, in case anything changed
      Invites.update(existingInvite._id, { $set: invite })

      // return the updated invite
      return Invites.findOne(existingInvite._id)
    }

    invite.inviteCode = this.Random.id()
    invite.status = status
    invite.referredBy = referredBy

    Invites.insert(invite)

    return invite
  }
}
