import React from 'react'
import {Flex} from 'jsxstyle'
import {SquareAvatar, NoPaddingListItem} from '/imports/modules/core/components/helpers.jsx'
import List from 'material-ui/lib/lists/list'
import RaisedButton from 'material-ui/lib/raised-button'
import Menu from '/imports/modules/core/components/menu.jsx'
import styles from '/imports/modules/core/components/styles.jsx'
import ListItem from 'material-ui/lib/lists/list-item'
import Avatar from 'material-ui/lib/avatar'
import muiStyles from 'material-ui/lib/styles'
import RightBar from '/imports/modules/core/components/layout.rightbar.jsx'

const Colors = muiStyles.Colors;

export default React.createClass({
  propTypes: {
    /**
     * Proptypes are also indirectly passed to Menu
     */
    ...Menu.propTypes,

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
     * Function to show topic followers modal from a ready list of followers
     */
    showTopicFollowersFromFollowersListFn: React.PropTypes.func.isRequired
  },

  render() {
    const isRightBarOpen = this.props.postListType == null;
    return (
      <main style={Object.assign({}, styles.main, { marginLeft: this.props.sidebarOpen ? 240 : 0, marginRight: isRightBarOpen ? 320 : 0 })}>
        <Menu
          hidePostButton={this.props.isEmpty}
          {...this.props} />

        { this.props.isEmpty ? <EmptyPostList {...this.props} /> : <PostList {...this.props} /> }
        <RightBar isOpen={isRightBarOpen} {...this.props} />
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
};

const EmptyPostListNotInFeed = ({ showAddPostPopupFn }) => (
  <Flex className='post-list-empty' flex={1} flexDirection='column'
    justifyContent='center' alignItems='center'>
    <h2>It's awfully quiet in here</h2>
    <h3>Let's break the ice</h3>
    <RaisedButton
      primary={true}
      onTouchTap={showAddPostPopupFn}
      label='Create a new post' />
    <img src='/images/bg-empty-feed.png' alt='empty feed' style={{
        width: '50%',
        maxWidth: 468,
        maxHeight: 320,
        marginTop: 36,
      }}/>
  </Flex>
)

const EmptyPostListInFeed = ({ navigateToTopicListFn }) => (
  <Flex className='post-list-empty' flex={1} flexDirection='column'
    justifyContent='center' alignItems='center'>
    <h2>Your feed is empty :c</h2>
    <h3>Follow some topics to jumpstart your feed</h3>
    <RaisedButton
      primary={true}
      onTouchTap={navigateToTopicListFn}
      label='Follow Topics' />
    <img src='/images/bg-empty-feed.png' alt='empty feed' style={{
        width: '50%',
        maxWidth: 468,
        maxHeight: 320,
        marginTop: 36,
      }}/>
  </Flex>
)

const PostList = (props) => (
  <section className='post-list' style={{flexGrow: 1}}>
    <List style={{padding: '0px 20px'}}>
      { props.posts.map(post =>
        <PostListItem key={post._id} post={post} {...props} />
      )}
    </List>
  </section>
)

const PostListItem = (props) => (
  <ListItem disabled={true} style={{
      borderBottom: '1px solid #e0e0e0',
      padding: 24
    }}>
    <Flex flexDirection='column'>
      <Flex flexDirection='row'>
        { props.post.topics.map(topic =>
          <span key={topic._id} style={{marginRight: 10}}>
            <a href="#" onClick={() => {
              props.navigateToTopic(topic._id);
              return false;
            }} style={{ color: '#d3d4d7'}}>
              #{topic.displayName}
            </a>
          </span>
        )}
      </Flex>
      <a href={props.post.url} style={{marginTop: 7}}>
        <h2>{props.post.title}</h2>
      </a>
      <Flex flexDirection='row' style={{marginTop: 7}}>
        <Avatar src={props.post.owner.avatar.url} size={50}/>
        <Flex flexDirection='column' flexGrow={1} style={{marginLeft: 7}}>
          <Flex flexDirection='row'>
            <a href='#' onClick={() => props.showUserProfile(props.post.owner)}>
              <span className='display-name'>
                { props.post.owner.displayName }
              </span>
            </a>
            <a href='#' onClick={() => props.showUserProfile(props.post.owner)}>
              <span className='mention'>
                @{ props.post.owner.username }
              </span>
            </a>
            <span className='datetime'>{ props.post.timestamp }</span>
          </Flex>
          <a href={props.post.url} style={{marginTop: 4}}>
            <p>{ props.post.truncatedContent }</p>
          </a>
          { !props.post.numMsgs || props.post.numMsgs == 0 ? null :
            <a href={props.post.url} style={{marginTop: 5, alignSelf: 'center', color: '#6A6A6A'}}>
              <span>{ props.post.numMsgs } more messages </span>
            </a>
          }
        </Flex>
      </Flex>
      <Flex flexDirection='row' justifyContent='space-between' marginTop={10}>
        <Flex alignItems='center'>
          <FollowersBtn {...props}/>
        </Flex>
        <Flex alignItems='center'>
          <FollowBtn {...props} style={{marginRight: 24}}/>
          <a href={props.post.url}>
            <b>reply</b>
          </a>
        </Flex>
      </Flex>
    </Flex>
  </ListItem>
)

const FollowersBtn = (props) => (
  props.post.numFollowers === 0 ?
    <Flex alignItems='center'>No Followers</Flex>
    :
    <Flex alignItems='center'>
      <a href='#' onClick={() => props.showPostFollowers(props.post.followers)} style={{display: 'flex', alignItems: 'center'}}>
      <span style={{marginRight: 7}}>Followers:</span>
      { props.post.followerAvatars.map(followerAvatar => <Avatar key={followerAvatar.userId} src={followerAvatar.url} size={30} style={{marginRight: 5}} />) }
      { props.post.moreFollowersNumber == 0 ? null : <Avatar size={30} backgroundColor={'rgba(0, 0, 0, 0)'} color='black' style={{ border: 'solid 1px ' + Colors.grey300, fontSize: 14 }}>+{props.post.moreFollowersNumber}</Avatar> }
      </a>
    </Flex>
)

const FollowBtn = (props) => (
  props.post.isFollowingPost
    ? <a href='#' style={props.style} onClick={() => props.unfollowPostFn(props.post._id)}><b>unfollow</b></a>
  : <a href='#' style={props.style} onClick={() => props.followPostFn(props.post._id)}><b>follow</b></a>
)
