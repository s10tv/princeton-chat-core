import invariant from 'invariant'
import ReactDOMServer from 'react-dom/server'
import React from 'react'
import GuestToggleFollow from '/imports/modules/guest/toggleFollowing.jsx'
import htmlPage from './html'

HTTP.methods({
  'guest/posts/:postId/:action': function() {
    // TOOD: CHECK USER AUTHENTICATION
    const post = Posts.findOne(this.params.postId)
    if (!post) {
      this.setStatusCode(404)
      return 'Not Found'
    }
    const action = this.params.action
    let isFollowing = false
    if (action === 'follow') {
      // Meteor.call('post/follow', post._id)
      isFollowing = true
    } else if (action === 'unfollow') {
      // Meteor.call('post/unfollow', post._id)
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
          followLink={`/guest/posts/${post._id}/follow`}
          unfollowLink={`/guest/posts/${post._id}/unfollow`} />
      )
    })
  }
})
