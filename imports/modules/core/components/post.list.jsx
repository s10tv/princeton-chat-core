import React from 'react'
import {SquareAvatar, NoPaddingListItem} from './helpers.jsx'
import List from 'material-ui/lib/lists/list'

const FollowBtn = (props) => (
  props.post.isFollowingPost
    ? <a href='#' onClick={props.post.onUnFollow}>Following</a>
    : <a href='#' onClick={props.post.onFollow}>Follow</a>
)

const PostListItem = (props) => (
  <NoPaddingListItem disabled={true}>
    <article>
      <SquareAvatar src={props.post.owner.avatar.url} length={60} />
      <div className='right-container'>
        <header>
          <span className='display-name'>
            <a href='#' onClick={props.post.showUserProfile}>
              { props.post.owner.displayName }
            </a>
          </span>
          <span className='mention'>@{ props.post.owner.username }</span>
          <span className='datetime'>{ props.post.timestamp }</span>
        </header>
        <h2>
          <a href={props.post.url}>
            { props.post.title }
          </a>
        </h2>
        <p>
          { props.post.truncatedContent }
        </p>
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

export default (props) => (

  <section className='post-list' style={{flexGrow: 1}}>
    <List style={{paddingTop: 0, paddingBottom: 0}}>
      { props.posts.map(post =>
        <PostListItem key={post._id} post={post} {...props} />
      )}
    </List>
  </section>
)
