import React from 'react'
import {Flex} from 'jsxstyle'
import InputBox from '/imports/modules/core/containers/inputBox.js'
import {ScrollingContainer} from '/imports/modules/core/components/helpers.jsx'
import Menu from '/imports/modules/core/components/menu.jsx'
import {MessageGroup} from '/imports/modules/core/components/message.jsx'
import styles from '/imports/modules/core/components/styles.jsx'
import NavBar from './navbar.jsx'

export default React.createClass({

  propTypes: {
    /**
     * Proptypes are also indirectly passed to Menu
     */
    ...Menu.propTypes,
    
    title: React.PropTypes.string.isRequired,
    topics: React.PropTypes.array.isRequired,


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
// <Menu {...this.props} hidePostButton={false} hideAddNewUsersButton={true} />
    return (
      <main style={Object.assign({}, styles.main, { marginLeft: this.props.sidebarOpen ? 240 : 0 })}>
        <NavBar>
          <Flex alignSelf='stretch' flexDirection='column'>
            <Flex flex={1} alignItems='center'>
              { this.props.topics.map(topic => 
                <span key={topic._id}>{`#${topic.displayName}`}</span>
              )}
            </Flex>
            <h1 style={{margin: 0, flex: 1, fontWeight: 500, fontSize: 24}}>{this.props.title}</h1>
          </Flex>
        </NavBar>
        <ScrollingContainer child={
          <article className='post-details'>
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
