import React from 'react'
import {Flex, Block} from 'jsxstyle'
import {Message, MessageGroup, InputBox} from './message.jsx'

export default (props) => (
  <Flex flexDirection='column' {...props}>
    <article className='post-details'>
      <header>
        <h1>Section 1.10.32 of 'de Finibus Bonorum et Malorum", written by Cicero in 45 BC</h1>
        <div>
          <span className='topic'>Legal</span>
          <span className='topic'>Operation</span>
          <span className='topic'>Programming</span>
          <span className='spacer' />
          <span className='comments-count'>2 comments</span>
        </div>
      </header>
      <MessageGroup />
      <MessageGroup />
      <MessageGroup />
      <MessageGroup />
      <MessageGroup />
      <MessageGroup />
    </article>
    <InputBox />
  </Flex>
)
