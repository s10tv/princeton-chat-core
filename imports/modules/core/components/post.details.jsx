import React from 'react'
import {Flex} from 'jsxstyle'
import InputBox from '/imports/modules/core/containers/inputBox.js'
import {ScrollingContainer} from '/imports/modules/core/components/helpers.jsx'
import Menu from '/imports/modules/core/components/menu.jsx'
import {MessageGroup} from '/imports/modules/core/components/message.jsx'
import styles from '/imports/modules/core/components/styles.jsx'

export default React.createClass({

  propTypes: {
    /**
     * Proptypes are also indirectly passed to Menu
     */
    ...Menu.propTypes,

    /**
     * Post detail to render.
     */
    post: React.PropTypes.object.isRequired,

    /**
     * A list of messages for this post. Can be empty, but is required.
     */
    messages: React.PropTypes.array.isRequired,

    /**
     * Determines whether to expand the content to 100% or make room for sidebar.
     */
    sidebarOpen: React.PropTypes.bool.isRequired,

    /**
     * Determines whether this is a direct message or a post detail.
     */
    isDirectMessage: React.PropTypes.bool.isRequired,
  },

  render() {
    const { post, messages, showUserProfilePost, showUserProfileMessage } = this.props;

    return (
      <main style={Object.assign({}, styles.main, { marginLeft: this.props.sidebarOpen ? 240 : 0 })}>
        <Menu {...this.props} hidePostButton={false} />

        <ScrollingContainer child={
          <article className='post-details'>
            <header>
              <h1>{post.title}</h1>
            </header>
            <MessageGroup owner={post.owner} timestamp={post.timestamp} content={post.content} showUserProfile={() => showUserProfilePost(post)} />
            { messages.map(message =>
              <MessageGroup
                key={message._id}
                owner={message.owner}
                timestamp={message.timestamp}
                content={message.content}
                showUserProfile={() => showUserProfileMessage(message)} />
            )}
          </article>
        } />
        <InputBox postId={post._id} />
      </main>
    )
  }
})
