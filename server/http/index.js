import invariant from 'invariant'
import ReactDOMServer from 'react-dom/server'
import React from 'react'
import {Posts, Users} from '/lib/collections'
import {isValidHash} from '../lib/Auth'
import PostManager from '../lib/PostManager'
import GuestToggleFollow from './toggleFollowing.jsx'
import EmailSignup from '../emails/signup.jsx'
import EmailInvite from '../emails/invite.jsx'
import htmlEmail from '../emails/html.layout'
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
        title: 'Princeton.Chat',
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

    '/e/signup': function() {
      return htmlEmail({
        title: '[Princeton.Chat] hurrah, hurrah, hurrah. Almost there.',
        body: ReactDOMServer.renderToStaticMarkup(
          React.createElement(EmailSignup, {
            inviteLink: 'http://localhost/fake-link'
          })
        )
      })
    },


    '/e/invite-alum': function() {
      return htmlEmail({
        title: 'a title here',
        body: ReactDOMServer.renderToStaticMarkup(
          React.createElement(EmailInvite, {
            senderName: 'Tony',
            firstName: 'Qiming',
            inviteUrl: 'http://localhost/fake-link'
          })
        )
      })
    }
  })
}