import React from 'react'
import {Flex, Block} from 'jsxstyle'
import {SquareAvatar} from './helpers.jsx'

export const Message = (props) => (
  <div className='message'>
    <div>{ props.content }</div>
    { props.action }
  </div>
)

export const MessageGroup = (props) => (
  <Flex className='message-group' margin='0 24px' padding='16px 0' borderBottom='1px solid #eceeef'>
    <SquareAvatar src={props.owner.avatar.url} length={36} />
    <Block flex={1} marginLeft={8}>
      <header>
        <span className='display-name'>{ props.owner.displayName }</span>
        <span className='mention'>{ props.owner.displayUsername }</span>
        <span className='datetime'>{ props.timestamp }</span>
      </header>
      <Message {...props} />
    </Block>
  </Flex>
)
