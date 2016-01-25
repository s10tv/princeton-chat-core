import React from 'react'
import {Flex, Block} from 'jsxstyle'
import {Message, MessageGroup, InputBox} from './message.jsx'

export default (props) => (
  <Flex flexDirection='column' {...props}>
    <section className='message-history'>
      <MessageGroup />
      <MessageGroup />
      <MessageGroup />
      <MessageGroup />
      <MessageGroup />
      <MessageGroup />
    </section>
    <InputBox />
  </Flex>
)
