import React from 'react'
import {Flex} from 'jsxstyle'
import {SquareAvatar, NoPaddingListItem} from '/imports/modules/core/components/helpers.jsx'
import List from 'material-ui/lib/lists/list'
import RaisedButton from 'material-ui/lib/raised-button'
import Menu from '/imports/modules/core/components/menu.jsx'
import styles from '/imports/modules/core/components/styles.jsx'

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
  <NoPaddingListItem disabled={true}>
    <article>
      <a href='#' onClick={() => props.showUserProfile(props.post)}>
        <SquareAvatar src={props.post.owner.avatar.url} length={60} />
      </a>
      <div className='right-container'>
        <header>
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
        </header>
        <a href={props.post.url}>
          <h2>{ props.post.title }</h2>
        </a>
        <a href={props.post.url}>
          <p>{ props.post.truncatedContent }</p>
        </a>
        <footer>
          { props.post.topics.map(topic =>
            <span key={topic._id} className='topic'>
              <a href="#" onClick={() => {
                props.navigateToTopic(topic._id);
                return false;
              }}>
                { topic.displayName }
              </a>
            </span>
          )}
          <span className='spacer' />
          <span className='comments-count'>{ props.post.numMsgs} comments</span>
          <a href='#' onClick={() => props.showPostFollowers(props.post.followers)}>
            <span className='followers-count'>{ props.post.numFollowers } followers</span>
          </a>
          <span className='follow-button'>
            <FollowBtn {...props} />
          </span>
        </footer>
      </div>
    </article>
  </NoPaddingListItem>
)

const FollowBtn = (props) => (
  props.post.isFollowingPost
    ? <a href='#' onClick={() => props.unfollowPostFn(props.post._id)}>Following</a>
    : <a href='#' onClick={() => props.followPostFn(props.post._id)}>Follow</a>
)
