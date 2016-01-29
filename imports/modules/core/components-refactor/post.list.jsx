import React from 'react'
import {Flex} from 'jsxstyle'
import {SquareAvatar, NoPaddingListItem} from './helpers.jsx'
import List from 'material-ui/lib/lists/list'
import RaisedButton from 'material-ui/lib/raised-button'

const FollowBtn = (props) => (
  props.post.isFollowingPost
    ? <a href='#' onClick={props.post.onUnFollow}>Following</a>
    : <a href='#' onClick={props.post.onFollow}>Follow</a>
)

const PostListItem = (props) => (
  <NoPaddingListItem disabled={true}>
    <article>
      <a href='#' onClick={props.post.showUserProfile}>
        <SquareAvatar src={props.post.owner.avatar.url} length={60} />
      </a>
      <div className='right-container'>
        <header>
          <a href='#' onClick={props.post.showUserProfile}>
            <span className='display-name'>
              { props.post.owner.displayName }
            </span>
          </a>
          <a href='#' onClick={props.post.showUserProfile}>
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
              <a href="#" onClick={props.navigateToTopic.bind({ topic: topic })}>{ topic.displayName }</a>
            </span>
          )}
          <span className='spacer' />
          <span className='comments-count'>{ props.post.numMsgs} comments</span>
          <span className='followers-count'>{ props.post.numFollowers } followers</span>
          <span className='follow-button'>
            <FollowBtn {...props} />
          </span>
        </footer>
      </div>
    </article>
  </NoPaddingListItem>
)

const EmptyPostList = ({ showAddPostPopup }) => (
  <Flex className='post-list-empty' flex={1} flexDirection='column'
    justifyContent='center' alignItems='center'>
    <h2>It's awfully quiet in here</h2>
    <h3>Let's break the ice</h3>
    <RaisedButton
      primary={true}
      onTouchTap={showAddPostPopup}
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

export default (props) => (
  props.posts.length > 0 ? <PostList {...props} /> : <EmptyPostList {...props} />
)
