import React from 'react'
import {SquareAvatar, NoPaddingListItem} from './helpers.jsx'
import List from 'material-ui/lib/lists/list'

const PostListItem = () => (
  <NoPaddingListItem>
    <article>
      <SquareAvatar src='http://lorempixel.com/200/200/people/' length={60} />
      <div className='right-container'>
        <header>
          <span className='display-name'>Sara Johnson '11</span>
          <span className='mention'>@saraj</span>
          <span className='datetime'>7:32 pm</span>
        </header>
        <h2>Section 1.10.32 of 'de Finibus Bonorum et Malorum", written by Cicero in 45 BC</h2>
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
          totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto...
        </p>
        <footer>
          <span className='topic'>Legal</span>
          <span className='topic'>Operation</span>
          <span className='topic'>Programming</span>
          <span className='spacer' />
          <span className='comments-count'>2 comments</span>
          <span className='followers-count'>5 followers</span>
          <span className='follow-button'>follow</span>
        </footer>
      </div>
    </article>
  </NoPaddingListItem>
)

export default () => (
  
  <section className='post-list' style={{flexGrow: 1}}>
    <List style={{paddingTop: 0, paddingBottom: 0}}>
        <PostListItem />
        <PostListItem />
        <PostListItem />
        <PostListItem />
        <PostListItem />
        <PostListItem />
        <PostListItem />
    </List>
  </section>
)
