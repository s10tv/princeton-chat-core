import React from 'react';
import {Flex, Block} from 'jsxstyle';
import {Message, MessageGroup} from './message.jsx';
import InputBox from '../containers/inputBox.js';

export default (props) => (
  <Flex flexDirection='column' flex={1}>
    <article className='post-details'>
      <header>
        <h1>{ props.post.title }</h1>
        <div>
          <span className='topic'>Legal</span>
          <span className='topic'>Operation</span>
          <span className='topic'>Programming</span>
          <span className='spacer' />
          <span className='comments-count'>2 comments</span>
        </div>
      </header>
      <MessageGroup owner={props.owner} timestamp={props.post.timestamp} content={props.post.content} />
      { props.messages.map(message =>
        <MessageGroup key={message._id} owner={message.owner} timestamp={message.timestamp} content={message.content} />
      )}
    </article>
    <InputBox postId={props.post._id} />
  </Flex>
)
