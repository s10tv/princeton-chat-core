import React from 'react'
import {Flex, Block} from 'jsxstyle'
import {SquareAvatar, NoPaddingListItem} from './helpers.jsx'
import TextField from 'material-ui/lib/text-field'

const Message = () => (
  <p>
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto...
  </p>
)

const MessageGroup = () => (
  <Flex className='message-group' marginLeft={24} padding='16px 0' borderBottom='1px solid #eceeef'>
    <SquareAvatar src='http://lorempixel.com/200/200/people/' length={60} />
    <Block flex={1} marginLeft={16}>
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

const InputBox = () => (
  <Flex className='input-box' margin={16} padding='0px 12px' border='2px solid #eceeef' borderRadius={5}>
    <TextField multiLine={true} fullWidth={true} underlineShow={false} hintText='Say something Im giving up on you' />
  </Flex>
)

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
