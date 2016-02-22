import invariant from 'invariant'
import ReactDOMServer from 'react-dom/server'
import React from 'react'
import {Posts, Users} from '/lib/collections'
import {isValidHash} from '../lib/Auth'
import PostManager from '../lib/PostManager'
import GuestToggleFollow from './toggleFollowing.jsx'
import { Signup, Invite, InviteNonAlum, htmlEmail, RecoverEmail } from '../emails'
import { title } from '/imports/env'
import EmailInvite from '../emails/princeton/invite.jsx'
import htmlPage from './html'

export default function () {
  HTTP.methods({
    'guest/posts/:postId/:action': function() {
      const {postId, action} = this.params;
      const {userId, hash} = this.query;

      const user = Users.findOne(userId)
      if (!user) {
        this.setStatusCode(404)
        return 'Not Found'
      }

      if (!isValidHash(user, hash)) {
        this.setStatusCode(404)
        return 'Not Found'
      }

      const post = Posts.findOne(postId)
      if (!post) {
        this.setStatusCode(404)
        return 'Not Found'
      }
      let isFollowing = false

      if (action === 'follow') {
        PostManager.follow({ user, postId: postId })
        isFollowing = true
      } else if (action === 'unfollow') {
        PostManager.unfollow({ user, postId: postId })
        isFollowing = false
      } else {
        this.setStatusCode(404)
        return 'Not Found - Action not allowed'
      }
      return htmlPage({
        title: title,
        body: ReactDOMServer.renderToStaticMarkup(
          React.createElement(GuestToggleFollow, {
            title: post.title,
            isFollowing: isFollowing,
            followLink: `/guest/posts/${postId}/follow?userId=${userId}&hash=${hash}`,
            unfollowLink: `/guest/posts/${postId}/unfollow?userId=${userId}&hash=${hash}`,
            editTopicsLink: `/guest?userId=${userId}&hash=${hash}`
          })
        )
      })
    },

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

    '/e/signup': function() {
      return htmlEmail({
        title: '[Princeton.Chat] hurrah, hurrah, hurrah. Almost there.',
        body: ReactDOMServer.renderToStaticMarkup(
          React.createElement(Signup, {
            inviteLink: 'http://localhost/fake-link'
          })
        )
      })
    },


    '/e/invite-alum': function() {
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

    '/e/invite-non-alum': function() {
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
