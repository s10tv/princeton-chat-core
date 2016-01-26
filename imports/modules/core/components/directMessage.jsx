import React from 'react'
import {Flex, Block} from 'jsxstyle'
import {Message, MessageGroup, InputBox} from './message.jsx'
import Paper from 'material-ui/lib/paper'
import Card from 'material-ui/lib/card/card'

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
    <Paper style={{'width': '320px'}} className='info-panel'>
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
      <section className='profile-info'>
        <h3>Followed Topics</h3>
        <ul>
          <li>#economics</li>
          <li>#consulting</li>
          <li>#firefly</li>
          <li>#random</li>
        </ul>
        <div className='profile-info-table'>
          <div className="row">
            <label>User #</label>
            <span>3</span>
          </div>
          <div className="row">
            <label>Email that is super long</label>
            <span>tonyx.xiddda.h2222.sa@alumni.princeton.edu</span>
          </div>
          <div className="row">
            <label>Last active</label>
            <span>Yesterday</span>
          </div>
          <div className="row">
            <label>Email</label>
            <span>tonyx.ca@alumni.princeton.edu</span>
          </div>
        </div>
      </section>
    </Paper>
  </Flex>
)
