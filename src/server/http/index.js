/*global HTTP*/
import ReactDOMServer from 'react-dom/server'
import React from 'react'
import emails from '../emails'

const { Signup, Invite, InviteNonAlum, htmlEmail, RecoverEmail } = emails

export default function () {
  HTTP.methods({
    '/e/email-sent': function () {
      return htmlEmail({
        title: 'a title here',
        body: ReactDOMServer.renderToStaticMarkup(
          React.createElement(RecoverEmail, {
            recoveryLink: 'http://localhost/fake-link'
          })
        )
      })
    },

    '/e/signup': function () {
      return htmlEmail({
        title: '[Princeton.Chat] hurrah, hurrah, hurrah. Almost there.',
        body: ReactDOMServer.renderToStaticMarkup(
          React.createElement(Signup, {
            inviteLink: 'http://localhost/fake-link'
          })
        )
      })
    },

    '/e/invite-alum': function () {
      return htmlEmail({
        title: 'a title here',
        body: ReactDOMServer.renderToStaticMarkup(
          React.createElement(Invite, {
            senderName: 'Tony',
            firstName: 'Qiming',
            inviteUrl: 'http://localhost/fake-link'
          })
        )
      })
    },

    '/e/invite-non-alum': function () {
      return htmlEmail({
        title: 'a title here',
        body: ReactDOMServer.renderToStaticMarkup(
          React.createElement(InviteNonAlum, {
            senderName: 'Tony',
            firstName: 'Qiming',
            rootURL: 'http://fake-url'
          })
        )
      })
    }
  })
}
