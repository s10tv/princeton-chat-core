import invariant from 'invariant'
import ReactDOMServer from 'react-dom/server'
import React from 'react'
import {isValidHash} from '/imports/server/Auth'
import PostManager from '/imports/server/PostManager'
import GuestToggleFollow from '/imports/modules/guest/components/toggleFollowing.jsx'
import htmlPage from './html'

HTTP.methods({
  'guest/posts/:userId/:hash/:postId/:action': function() {
    const user = Users.findOne(this.params.userId)
    if (!user) {
      this.setStatusCode(404)
      return 'Not Found'
    }

    if (!isValidHash(user, this.params.hash)) {
      this.setStatusCode(404)
      return 'Not Found'
    }

    const post = Posts.findOne(this.params.postId)
    if (!post) {
      this.setStatusCode(404)
      return 'Not Found'
    }
    const action = this.params.action
    let isFollowing = false

    if (action === 'follow') {
      PostManager.follow({ user, postId: this.params.postId })
      isFollowing = true
    } else if (action === 'unfollow') {
      PostManager.unfollow({ user, postId: this.params.postId })
      isFollowing = false
    } else {
      this.setStatusCode(404)
      return 'Not Found - Action not allowed'
    }
    return htmlPage({
      title: 'My page',
      body: ReactDOMServer.renderToStaticMarkup(
        <GuestToggleFollow
          title={post.title}
          isFollowing={isFollowing}
          followLink={`/guest/posts/${this.params.userId}/${this.params.hash}/${post._id}/follow`}
          unfollowLink={`/guest/posts/${this.params.userId}/${this.params.hash}/${post._id}/unfollow`} />
      )
    })
  }
})
