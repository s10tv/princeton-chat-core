import React from 'react'
import {Flex} from 'jsxstyle'
import {SquareAvatar, NoPaddingListItem} from '/imports/modules/core/components/helpers.jsx'
import List from 'material-ui/lib/lists/list'
import RaisedButton from 'material-ui/lib/raised-button'
import Menu from '/imports/modules/core/components/menu.jsx'
import styles from '/imports/modules/core/components/styles.jsx'
import ListItem from 'material-ui/lib/lists/list-item'
import Avatar from 'material-ui/lib/avatar'

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
  },

  render() {
    return (
      <main style={Object.assign({}, styles.main, { marginLeft: this.props.sidebarOpen ? 240 : 0 })}>
        <Menu
          hideAddNewUsersButton={true}
          hidePostButton={this.props.isEmpty}
          {...this.props} />

        { this.props.isEmpty ? <EmptyPostList {...this.props} /> : <PostList {...this.props} /> }
      </main>
    )
  }
})

const EmptyPostList = ({ showAddPostPopupFn }) => (
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

const PostList = (props) => (
  <section className='post-list' style={{flexGrow: 1}}>
    <List style={{paddingTop: 0, paddingBottom: 0}}>
      { props.posts.map(post =>
        <PostListItem key={post._id} post={post} {...props} />
      )}
    </List>
  </section>
)

const PostListItem = (props) => (
  <ListItem disabled={true} style={{
      maxWidth: '70vh',
      margin: '36px auto',
      backgroundColor: '#f9f9f9',
      border: '1px solid #979797',
      borderRadius: 3,
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
        <Flex flexDirection='column' style={{marginLeft: 7}}>
          <Flex flexDirection='row'>
            <a href='#' onClick={() => props.showUserProfile(props.post)}>
              <span className='display-name'>
                { props.post.owner.displayName }
              </span>
            </a>
            <a href='#' onClick={() => props.showUserProfile(props.post)}>
              <span className='mention'>
                @{ props.post.owner.username }
              </span>
            </a>
            <span className='datetime'>{ props.post.timestamp }</span>
          </Flex>
          <a href={props.post.url} style={{marginTop: 4}}>
            <p>{ props.post.truncatedContent }</p>
          </a>
          { props.post.numMsgs == 0 ? null :
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
      <a href='#' onClick={() => props.showPostFollowers(props.post.followers)} style={{marginRight: 7}}>Followers:</a>
      { props.post.followerAvatars.map(followerAvatar => <Avatar key={followerAvatar.userId} src={followerAvatar.url} size={30} style={{marginRight: 5}} />) }
    </Flex>
)

const FollowBtn = (props) => (
  props.post.isFollowingPost
    ? <a href='#' style={props.style} onClick={() => props.unfollowPostFn(props.post._id)}><b>unfollow</b></a>
  : <a href='#' style={props.style} onClick={() => props.followPostFn(props.post._id)}><b>follow</b></a>
)
