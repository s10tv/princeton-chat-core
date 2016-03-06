import React from 'react'
import {Flex} from 'jsxstyle'
import InputBox from '/client/modules/core/containers/inputBox.js'
import {ScrollingContainer} from '/client/lib/helpers.jsx'
import {MessageGroup} from '/client/modules/core/components/message.jsx'
import styles from '/client/modules/core/components/styles.jsx'
import NavBar from './navbar.jsx'
import {FlatButton, FontIcon, Dialog} from '/client/lib/ui.jsx'

export default React.createClass({

  propTypes: {
    /**
     * Proptypes are also indirectly passed to Menu
     */
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
     * Determines whether this is a direct message or a post detail.
     */
    isDirectMessage: React.PropTypes.bool.isRequired,

    /**
     * The function navigates the user to the topic list screen.
     */
    navigateToTopic: React.PropTypes.func.isRequired,

    deleteMessage: React.PropTypes.func.isRequired,

    showUserProfileMessage: React.PropTypes.func.isRequired,

    showUserProfilePost: React.PropTypes.func.isRequired,

    /**
     * If the owner of the post is the current user, the button to delete the post is shown
     */
    isPostDeletable: React.PropTypes.bool.isRequired,

    /**
     * Func to delete post
     */
    deletePost: React.PropTypes.func.isRequired,
    isMobile: React.PropTypes.bool.isRequired,
    messageLinkOnClick: React.PropTypes.func.isRequired
  },

  getInitialState () {
    return {
      isOpen: false
    }
  },

  openConfirmation () {
    this.setState({
      isOpen: true
    })
  },

  closeConfirmation () {
    this.setState({
      isOpen: false
    })
  },

  render () {
    const { post, messages, showUserProfilePost, showUserProfileMessage,
      deleteMessage, messageLinkOnClick} = this.props

    return (
      <Flex style={styles.main}>
        <NavBar>
          <Flex alignSelf='stretch' justifyContent='space-between'>
            <Flex flexDirection='column'>
              <Flex flexDirection='row'>
                <h1 style={{margin: 0, flex: 1, fontWeight: 400, fontSize: 24}}>
                  {this.props.title}
                </h1>
              </Flex>

              <Flex flex={1} alignItems='center' style={{lineHeight: '28px'}}>
                {this.props.topics.map((topic) =>
                  <a key={topic._id} style={{
                    color: '#cccccc',
                    cursor: 'pointer',
                    fontWeight: 300,
                    marginRight: 6
                  }}
                    onClick={() => this.props.navigateToTopic(topic._id)}>
                    {`#${topic.displayName}`}
                  </a>
                )}
              </Flex>
            </Flex>
            {!this.props.isPostDeletable || this.props.isMobile
              ? null
              : <div>
                <FlatButton
                  label='Delete Post'
                  labelPosition='after'
                  icon={<FontIcon className='material-icons'>remove</FontIcon>}
                  onTouchTap={this.openConfirmation}
                  style={{width: '100%', marginTop: 10, color: '#E0E0E0'}}/>

                <Dialog
                  title={'Are you sure?'}
                  modal={false}
                  open={this.state.isOpen}
                  actions={[
                    <FlatButton
                      label='Cancel'
                      style={{ color: '#E0E0E0' }}
                      onTouchTap={this.closeConfirmation} />,
                    <FlatButton
                      label='Delete'
                      style={{ color: '#F44336' }}
                      onTouchTap={() => this.props.deletePost(this.props.post._id)} />
                  ]}
                  onRequestClose={this.closeConfirmation}>
                  <p>
                  Deleting a post cannot be undone. Users who have already gotten notifications
                  will not be able to view this post.
                  </p>
                </Dialog>
              </div>
            }
          </Flex>
        </NavBar>
        <ScrollingContainer child={
          <Flex flexGrow={1} flexDirection='column' className='no-scrollbar' overflowY='scroll'>
            <MessageGroup owner={post.owner}
              timestamp={post.timestamp}
              content={post.content}
              messageLinkOnClick={messageLinkOnClick}
              showUserProfile={() => showUserProfilePost(post)} />
            {messages.map((message) =>
              <MessageGroup
                key={message._id}
                owner={message.owner}
                timestamp={message.timestamp}
                content={message.content}
                attachments={message.attachments}
                messageLinkOnClick={messageLinkOnClick}
                deleteMessage={message.canDelete ? () => deleteMessage(message._id) : null}
                showUserProfile={() => showUserProfileMessage(message)} />
            )}
          </Flex>
        } />
        <InputBox postId={post._id} />
      </Flex>
    )
  }
})
