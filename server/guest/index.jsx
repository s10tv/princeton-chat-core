import invariant from 'invariant'
import ReactDOMServer from 'react-dom/server'
import React from 'react'
import {Posts, Users} from '/lib/collections'
import {isValidHash} from '../lib/Auth'
import PostManager from '../lib/PostManager'
import GuestToggleFollow from './toggleFollowing.jsx'
import htmlPage from './html'

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
        <GuestToggleFollow
          title={post.title}
          isFollowing={isFollowing}
          followLink={`/guest/posts/${postId}/follow?userId=${userId}&hash=${hash}`}
          unfollowLink={`/guest/posts/${postId}/unfollow?userId=${userId}&hash=${hash}`}
          editTopicsLink={`/guest?userId=${userId}&hash=${hash}`}
        />
      )
    })
  }
})
