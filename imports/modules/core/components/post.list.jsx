import React from 'react'
import {Flex} from 'jsxstyle'
import {LetterAvatar, CoverAvatar} from '/imports/modules/core/components/helpers.jsx'
import List from 'material-ui/lib/lists/list'
import RaisedButton from 'material-ui/lib/raised-button'
import Menu from '/imports/modules/core/components/menu.jsx'
import styles from '/imports/modules/core/components/styles.jsx'
import ListItem from 'material-ui/lib/lists/list-item'
import RightBar from '/imports/modules/core/components/layout/layout.rightbar.jsx'
import FlatButton from 'material-ui/lib/flat-button'
import { i18n } from '/imports/libs/mantra'
import Avatar from 'material-ui/lib/avatar'

const theme = i18n('secondaryMuiTheme')

export default React.createClass({
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

  // render () {
  //   const isRightBarOpen = this.props.postListType == null
  //   return (
  //     <main style={Object.assign({}, styles.main, { marginLeft: this.props.sidebarOpen ? 240 : 0, marginRight: isRightBarOpen ? 320 : 0 })}>
  //       <Menu
  //         hidePostButton={this.props.isEmpty}
  //         {...this.props} />
  //
  //       {this.props.isEmpty ? <EmptyPostList {...this.props} /> : <PostList {...this.props} />}
  //       <RightBar isOpen={isRightBarOpen} {...this.props} />
  //     </main>
  //   )
  // }
  render () {
    const isRightBarOpen = this.props.postListType == null
    return (
      <main style={Object.assign({}, styles.main, {
        marginLeft: this.props.sidebarOpen ? 240 : 0
      })}>
        <Flex flexDirection='column' flexGrow='1'>
          <Menu
            hidePostButton={this.props.isEmpty}
            isPostListScreen
            {...this.props} />
          <Flex>
            {this.props.isEmpty
              ? <EmptyPostList {...this.props} />
              : <PostList {...this.props} />}
            {isRightBarOpen ? <RightBar {...this.props} /> : null}
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
  <Flex className='post-list-empty' flex={1} flexDirection='column'
    justifyContent='center' alignItems='center'>
    <h2>It's awfully quiet in here</h2>
    <h3>Let's break the ice</h3>
    <RaisedButton
      primary
      onTouchTap={showAddPostPopupFn}
      label='Create a new post' />
    <img src='/images/bg-empty-feed.png' alt='empty feed'
      style={{
        width: '50%',
        maxWidth: 468,
        maxHeight: 320,
        marginTop: 36
      }}/>
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
  <section className='post-list' style={{flexGrow: 1}}>
    <List style={{padding: '0px 0px', paddingLeft: 10}}>
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
          {props.post.owner.avatar.isDefaultAvatar
            ? <LetterAvatar
              color='white'
              backgroundColor={props.post.owner.avatar.color}
              size={35}
              style={{marginRight: 10}}>
                {props.post.owner.avatarInitials}
            </LetterAvatar>
            : <CoverAvatar src={props.post.owner.avatar.url} size={35} style={{marginRight: 10}} />
          }
          <a href='#' onClick={() => props.showUserProfile(props.post.owner)}>
            <span className='display-name'>
              {props.post.owner.displayName}
            </span>
          </a>
          <a href='#' onClick={() => props.showUserProfile(props.post.owner)}>
            <span className='mention' style={Object.assign({}, {
              color: theme.baseTheme.palette.accent1Color
            })}>
              @{props.post.owner.username}
            </span>
          </a>
          <span className='datetime'>{props.post.timestamp}</span>
        </Flex>
        <Flex marginRight={16}>
          <a href={props.post.url}>
            <Flex alignItems='center'>
              <span style={{color: '#999', marginRight: 10, fontWeight: 300}}>{props.post.numMsgs}</span>
              <img src='/images/chat-bubble.svg' />
            </Flex>
          </a>
        </Flex>
      </Flex>

      <Flex style={{marginTop: 20}}>
        {props.post.topics.map((topic) =>
          <span key={topic._id} style={{marginRight: 10}}>
            <a href='#' onClick={() => {
              props.navigateToTopic(topic._id)
              return false
            }} style={{ fontWeight: 300, color: '#d3d4d7' }}>
              #{topic.displayName}
            </a>
          </span>
        )}
      </Flex>

      <a href={props.post.url} style={{marginTop: 12}}>
        <h2>{props.post.title}</h2>
      </a>

      <a href={props.post.url} style={{marginTop: 12, letterSpacing: '0.1px'}}>
        <p>{props.post.truncatedContent}</p>
      </a>

      <Flex flexDirection='row' justifyContent='space-between' marginTop={20}>
        <Flex alignItems='center'>
          <FollowersBtn {...props}/>
        </Flex>
        <Flex alignItems='center'>
          <FollowBtn {...props} />
        </Flex>
      </Flex>
    </Flex>
  </ListItem>
)

const FollowersBtn = (props) => (
  props.post.numFollowers === 0
  ? <Flex alignItems='center' fontSize={15}>No Followers</Flex>
  : <Flex alignItems='center'>
    <a href='#'
      onClick={() => props.showPostFollowers(props.post.followers)}
      style={{display: 'flex', alignItems: 'center'}}>

      <span style={{marginRight: 7, fontSize: 15, fontWeight: 300, color: '#999'}}>
        {props.post.followers.length > 1 ? 'Followers:' : 'Follower:'}
      </span>

      {props.post.followerAvatars.map((followerAvatar) =>
        followerAvatar.avatar.isDefaultAvatar
        ? <LetterAvatar key={followerAvatar.userId}
          size={30}
          color='white'
          backgroundColor={followerAvatar.avatar.color}
          style={{marginRight: 5}}>
          {followerAvatar.avatarInitials}
        </LetterAvatar>
        : <CoverAvatar key={followerAvatar.userId}
          src={followerAvatar.avatar.url}
          size={30}
          style={{marginRight: 5}} />
      )}

      {props.post.moreFollowersNumber === 0
        ? null
        : <Avatar size={30} backgroundColor={'rgba(0, 0, 0, 0)'}
          color='#999'
          style={{ border: 'solid 1px #999', fontSize: 14, fontWeight: 300 }}>
            +{props.post.moreFollowersNumber}
        </Avatar>}
    </a>
  </Flex>
)

const FollowBtn = (props) => (
  props.post.isFollowingPost
    ? <FlatButton primary label='Unfollow'
      onTouchTap={() => props.unfollowPostFn(props.post._id)} />
    : <FlatButton primary label='Follow'
      onTouchTap={() => props.followPostFn(props.post._id)} />
)
