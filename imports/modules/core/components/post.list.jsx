import React from 'react'
import {SquareAvatar, NoPaddingListItem} from './helpers.jsx'
import List from 'material-ui/lib/lists/list'

const PostListItem = (props) => (
  <NoPaddingListItem>
    <article>
      <SquareAvatar src={props.post.owner.avatar.url} length={60} />
      <div className='right-container'>
        <header>
          <span className='display-name'>
            { props.post.owner.displayName }
          </span>
          <span className='mention'>@{ props.post.owner.username }</span>
          <span className='datetime'>{ props.post.timestamp }</span>
        </header>
        <h2>{ props.post.title }</h2>
        <p>
          { props.post.truncatedContent }
        </p>
        <footer>
          { props.post.topics.map(topic =>
            <span key={topic._id} className='topic'>{ topic.displayName }</span>
          )}
          <span className='spacer' />
          <span className='comments-count'>2 comments</span>
          <span className='followers-count'>5 followers</span>
          <span className='follow-button'>follow</span>
        </footer>
      </div>
    </article>
  </NoPaddingListItem>
)

export default (props) => (

  <section className='post-list' style={{flexGrow: 1}}>
    <List style={{paddingTop: 0, paddingBottom: 0}}>
      { props.posts.map(post =>
        <PostListItem key={post._id} post={post} />
      )}
    </List>
  </section>
)
