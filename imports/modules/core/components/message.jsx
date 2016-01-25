import React from 'react'
import {Flex, Block} from 'jsxstyle'
import {SquareAvatar} from './helpers.jsx'
import TextField from 'material-ui/lib/text-field'

export const Message = () => (
  <p className='message'>
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto...
  </p>
)

export const MessageGroup = () => (
  <Flex className='message-group' margin='0 24px' padding='16px 0' borderBottom='1px solid #eceeef'>
    <SquareAvatar src='http://lorempixel.com/200/200/people/' length={36} />
    <Block flex={1} marginLeft={8}>
      <header>
        <span className='display-name'>Sara Johnson '11</span>
        <span className='mention'>@saraj</span>
        <span className='datetime'>7:32 pm</span>
      </header>
      <Message />
      <Message />
    </Block>
  </Flex>
)

export const InputBox = () => (
  <Flex className='input-box' margin='0 16px 16px 16px' padding='0px 12px' border='2px solid #d9d9d9' borderRadius={5}>
    <TextField multiLine={true} fullWidth={true} underlineShow={false} rowsMax={8}
      hintText='Say something Im giving up on you' />
  </Flex>
)
