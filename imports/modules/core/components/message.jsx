import React from 'react'
import {Flex, Block} from 'jsxstyle'
import {SquareAvatar} from '/imports/modules/core/components/helpers.jsx'

export const Message = (props) => (
  <div className='message'>
    <div className='message-content'>{ props.content }</div>
    { props.action }
  </div>
)

export const MessageGroup = (props) => (
  <Flex className='message-group' padding='8px 16px'>
    <a href="#" onClick={props.showUserProfile}>
      <SquareAvatar src={props.owner.avatar.url} length={50} />
    </a>
    <Block flex={1} marginLeft={8}>
      <header>
        <a href="#" onClick={props.showUserProfile}>
          <span className='display-name'>{ props.owner.displayName }</span>
        </a>
        <a href="#" onClick={props.showUserProfile}>
          <span className='mention'>{ props.owner.displayUsername }</span>
        </a>
        <span className='datetime'>{ props.timestamp }</span>
      </header>
      <Message {...props} />
    </Block>
  </Flex>
)
