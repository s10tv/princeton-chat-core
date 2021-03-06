import React from 'react'
import {Link} from 'react-router'
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
import {muiLinkButton} from '/client/lib/helpers'

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
     * The post list type is needed to show specific errors for empty screens
     */
    postListType: React.PropTypes.string,

    /**
     * The function navigates the user to the follow topics screen (used for the empty feed screen)
     */
    navigateToTopicListFn: React.PropTypes.func.isRequired,

    /**
     * Initial serach box value
     */
    currentSearchValue: React.PropTypes.string,

    rightBarHidden: React.PropTypes.bool.isRequired
  },

  render () {
    return (
      <div style={styles.main}>
        <Flex flexDirection='column' flexGrow={1}>
          <Menu
            currentSearchValue={this.props.currentSearchValue}
            hidePostButton={this.props.isEmpty}
            style={{
              marginBottom: 20
            }}
            {...this.props} />
          <Flex flex='1 1 0px' overflowY='scroll'>
            {this.props.isEmpty
              ? <EmptyPostList {...this.props} />
              : <PostList {...this.props} />}
            <RightBar hidden={this.props.rightBarHidden} {...this.props} />
          </Flex>
        </Flex>
      </div>
    )
  }
})

const EmptyPostList = (props) => {
  switch (props.postListType) {
    case 'ALL_MINE':
      return <EmptyPostListInFeed {...props} />

    case 'SEARCH':
      return <EmptyPostListSearch {...props} />

    default:
      return <EmptyPostListNotInFeed {...props} />
  }
}

const EmptyPostListSearch = ({ currentSearchValue }) => (
  <Flex marginTop={50} flexGrow={1} flexDirection='column' justifyContent='center' alignItems='center'>
    <FontIcon style={{fontSize: 50}} className='material-icons'>search</FontIcon>
    <h2 style={{fontWeight: 500}}>{"Sorry, we couldn't find any posts matching '{currentSearchValue}'"}</h2>
  </Flex>
)

const EmptyPostListNotInFeed = () => (
  <Flex className='post-list-empty' flexDirection='column' flex={1} padding={10} alignItems='center'>
    <Flex flexDirection='column' maxWidth={400} alignItems='center'>
      <h2 style={{fontWeight: 500}}>{"It's awfully quiet in here"}</h2>
      <h3 style={{fontWeight: 300, marginTop: 5}}>{"Let's break the ice"}</h3>
      <RaisedButton primary label='Create a new post' {...muiLinkButton('/add-post')}
        style={{marginTop: 5}}/>
    </Flex>
    <Flex marginTop={20} flexGrow={1}
      width='60%'
      backgroundImage='url(/images/bg-empty-feed.png)'
      backgroundRepeat='no-repeat'
      backgroundPosition='50% 0%'
      maxHeight={350}
      backgroundSize='contain' />
  </Flex>
)

const EmptyPostListInFeed = ({ navigateToTopicListFn }) => (
  <Flex className='post-list-empty' flexDirection='column' flex={1} paddingTop={10} alignItems='center'>
    <Flex flexDirection='column' maxWidth={400} alignItems='center'>
      <h2 style={{fontWeight: 500}}>Your feed is empty :c</h2>
      <h3 style={{fontWeight: 300}}>Follow some topics to jumpstart your feed</h3>
      <RaisedButton
        primary
        onTouchTap={navigateToTopicListFn}
        label='Follow Topics' />
    </Flex>
    <Flex marginTop={20} flexGrow={1}
      width='50%'
      backgroundImage='url(/images/bg-empty-feed.png)'
      backgroundSize='cover' />
  </Flex>
)

export const PostList = (props) => (
  <section className='post-list' style={{flexGrow: 1, overflowX: 'hidden'}}>
    <List style={{paddingTop: 0, paddingBottom: 0, paddingLeft: 10}}>
      {props.posts.map((post) =>
        <PostListItem key={post._id} post={post} {...props} />
      )}
    </List>
  </section>
)

export const PostListItem = (props) => (
  <ListItem
    disabled
    style={{
      borderBottom: '1px solid #e0e0e0',
      padding: 10
    }}>
    <Flex flexDirection='column'>
      <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
        <Flex alignItems='center'>
          <Link to={props.post.url} style={{color: 'black'}}>
            <h2 style={s.postTitle}>{props.post.title}</h2>
          </Link>
        </Flex>
        {props.post.numMsgs === 0
          ? null
          : <Flex flexShrink={0} marginRight={16}>
            <Link to={props.post.url}>
              <Flex alignItems='center'>
                <span style={{color: '#999', marginRight: 10, fontWeight: 300}}>{props.post.numMsgs}</span>
                <img src='/images/chat-bubble.svg' />
              </Flex>
            </Link>
          </Flex>
        }
      </Flex>

      <p style={s.postAuthor}>
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

      <p style={s.postContent}>{props.post.truncatedContent}</p>

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

export const FollowBtn = (props) => (
  props.post.isFollowingPost
    ? <FlatButton primary label='Unfollow'
      onTouchTap={() => props.unfollowPostFn(props.post._id)} />
    : <FlatButton primary label='Follow'
      onTouchTap={() => props.followPostFn(props.post._id)} />
)

const s = {
  postTitle: {
    fontSize: 20,
    lineHeight: '1em'
  },
  postContent: {
    marginTop: 12,
    letterSpacing: '0.1px',
    lineHeight: '1.2em'
  },
  postAuthor: {
    marginTop: 5,
    fontSize: '12px',
    '@media (max-width: 768px)': {
      marginTop: 10
    }
  }
}

export default Radium(PostListScreen)
