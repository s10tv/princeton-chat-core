import React from 'react'
import Radium from 'radium'
import {Flex} from 'jsxstyle'
import List from '../../../../node_modules/material-ui/lib/lists/list'
import RaisedButton from '../../../../node_modules/material-ui/lib/raised-button'
import Menu from '/client/modules/core/components/menu.jsx'
import styles from '/client/modules/core/components/styles.jsx'
import ListItem from '../../../../node_modules/material-ui/lib/lists/list-item'
import RightBar from '/client/modules/core/components/layout/layout.rightbar.jsx'
import FlatButton from '../../../../node_modules/material-ui/lib/flat-button'
import FontIcon from '../../../../node_modules/material-ui/lib/font-icon'

const PostListScreen = React.createClass({
  propTypes: {
    /**
     * Topic to render
     */
    topic: React.PropTypes.object.isRequired,

    /**
     * Posts to render (array can be empty).
     */
    posts: React.PropTypes.array.isRequired,

    /**
     * True if there are no posts in this list
     */
    isEmpty: React.PropTypes.bool,

    /**
     * A function to show the user profile associated with the post.
     */
    showUserProfile: React.PropTypes.func.isRequired,

    /**
     * A function to show the followers of the post.
     */
    showPostFollowers: React.PropTypes.func.isRequired,

    /**
     * The function to show a popup modal for adding new posts (in case of empty state).
     */
    showAddPostPopupFn: React.PropTypes.func.isRequired,

    /**
     * The post list type is needed to show specific errors for empty screens
     */
    postListType: React.PropTypes.string,

    /**
     * The function navigates the user to the follow topics screen (used for the empty feed screen)
     */
    navigateToTopicListFn: React.PropTypes.func.isRequired,

    /**
     * Boolean to show/hide sidebar
     */
    sidebarOpen: React.PropTypes.bool.isRequired
  },

  render () {
    return (
      <main style={Object.assign({}, styles.main, {
        marginLeft: this.props.sidebarOpen ? 240 : 0
      })}>
        <Flex flexDirection='column' flexGrow={1}>
          <Menu
            hidePostButton={this.props.isEmpty}
            style={{marginBottom: 20}}
            {...this.props} />
          <Flex>
            {this.props.isEmpty
              ? <EmptyPostList {...this.props} />
              : <PostList {...this.props} />}
            <RightBar {...this.props} />
          </Flex>
        </Flex>
      </main>
    )
  }
})

const EmptyPostList = (props) => {
  if (props.postListType === 'ALL_MINE') {
    return <EmptyPostListInFeed {...props} />
  } else {
    return <EmptyPostListNotInFeed {...props} />
  }
}

const EmptyPostListNotInFeed = ({ showAddPostPopupFn }) => (
  <Flex className='post-list-empty' flex={1} justifyContent='center'>
    <Flex marginTop={35} flexDirection='column' maxWidth={400} alignItems='center'>
      <h2 style={{fontWeight: 500}}>It's awfully quiet in here</h2>
      <h3 style={{fontWeight: 300}}>Let's break the ice</h3>
      <RaisedButton
        primary
        onTouchTap={() => showAddPostPopupFn()}
        label='Create a new post' />
      <img src='/images/bg-empty-feed.png' alt='empty feed'
        style={{
          maxWidth: 468,
          maxHeight: 320,
          marginTop: 36
        }}/>
    </Flex>
  </Flex>
)

const EmptyPostListInFeed = ({ navigateToTopicListFn }) => (
  <Flex className='post-list-empty' flex={1} flexDirection='column'
    justifyContent='center' alignItems='center'>
    <h2>Your feed is empty :c</h2>
    <h3>Follow some topics to jumpstart your feed</h3>
    <RaisedButton
      primary
      onTouchTap={navigateToTopicListFn}
      label='Follow Topics' />
    <img src='/images/bg-empty-feed.png' alt='empty feed'
      style={{
        width: '50%',
        maxWidth: 468,
        maxHeight: 320,
        marginTop: 36
      }}/>
  </Flex>
)

const PostList = (props) => (
  <section className='post-list' style={{flexGrow: 1, overflowX: 'hidden'}}>
    <List style={{paddingTop: 0, paddingBottom: 0, paddingLeft: 10}}>
      {props.posts.map((post) =>
        <PostListItem key={post._id} post={post} {...props} />
      )}
    </List>
  </section>
)

const PostListItem = (props) => (
  <ListItem
    disabled
    style={{
      borderBottom: '1px solid #e0e0e0',
      padding: 10
    }}>
    <Flex flexDirection='column'>
      <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
        <Flex alignItems='center'>
          <a href={props.post.url} style={{color: 'black'}}>
            <h2 style={{fontSize: '20px'}}>{props.post.title}</h2>
          </a>
        </Flex>
        {props.post.numMsgs === 0
          ? null
          : <Flex marginRight={16}>
            <a href={props.post.url}>
              <Flex alignItems='center'>
                <span style={{color: '#999', marginRight: 10, fontWeight: 300}}>{props.post.numMsgs}</span>
                <img src='/images/chat-bubble.svg' />
              </Flex>
            </a>
          </Flex>
        }
      </Flex>

      <p style={{marginTop: 5, fontSize: '12px'}}>
        Posted by
        <a href='#' style={{
          marginLeft: 3,
          marginRight: 3,
          fontWeight: 400
        }} onClick={() => props.showUserProfile(props.post.owner)}>
          <span className='display-name'>
            {props.post.owner.displayName}
          </span>
        </a>
        <span>{props.post.timestamp}</span>
      </p>

      <p style={{marginTop: 12, letterSpacing: '0.1px'}}>{props.post.truncatedContent}</p>

      <Flex flexDirection='row' justifyContent='space-between' marginTop={20}>
        <Flex alignItems='center'>
          <a href='#' style={{ color: '#d3d4d7', marginRight: 12 }} onClick={() => {
            props.showPostFollowers(props.post.followers)
          }}>
            <Flex alignItems='center'>
              <FontIcon className='material-icons' color='#d3d4d7'>group</FontIcon>
              <span style={{marginLeft: 3, fontWeight: 300}}>{props.post.followers.length}</span>
            </Flex>
          </a>
          {props.post.topics.map((topic) =>
            <span key={topic._id} style={{marginRight: 10}}>
              <a href='#' onClick={() => {
                props.navigateToTopic(topic._id)
                return false
              }} style={{ fontWeight: 300, color: '#d3d4d7' }}>
                {topic._id ? `#${topic.displayName}` : topic.displayName}
              </a>
            </span>
          )}
        </Flex>
        <Flex alignItems='center'>
          <FollowBtn {...props} />
        </Flex>
      </Flex>
    </Flex>
  </ListItem>
)

const FollowBtn = (props) => (
  props.post.isFollowingPost
    ? <FlatButton primary label='Unfollow'
      onTouchTap={() => props.unfollowPostFn(props.post._id)} />
    : <FlatButton primary label='Follow'
      onTouchTap={() => props.followPostFn(props.post._id)} />
)

export default Radium(PostListScreen)
