import React from 'react'
import {Flex, Block} from 'jsxstyle'
import {Message, MessageGroup, InputBox} from './message.jsx'
import Paper from 'material-ui/lib/paper'

export default (props) => (
  <Flex {...props}>
    <Flex flexDirection='column' flex={1}>
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
    <Paper style={{'width': '320px'}}>
      <section className='profile-header'>
        <div className='profile-cover' />
        <Flex flexDirection='column' alignItems='center' justifyContent='center' position='relative'
          padding='36px'>
          <img src='http://lorempixel.com/100/100/people/' className='profile-avatar' />
          <h2>Sara Jane</h2>
          <h3>@sara</h3>
          <p>I wish i was a little bit taller, wish i was a baller, wish i had a girl… also.</p>
        </Flex>
      </section>
    </Paper>
  </Flex>
)
