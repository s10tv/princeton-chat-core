import React from 'react'
import {Flex, Block} from 'jsxstyle'
import {SquareAvatar} from './helpers.jsx'
import TextField from 'material-ui/lib/text-field'

export const Message = (props) => (
  <p className='message'>
    { props.content }
  </p>
)

export const MessageGroup = (props) => (
  <Flex className='message-group' margin='0 24px' padding='16px 0' borderBottom='1px solid #eceeef'>
    <SquareAvatar src={props.owner.avatar.url} length={36} />
    <Block flex={1} marginLeft={8}>
      <header>
        <span className='display-name'>{ props.owner.displayName }</span>
        <span className='mention'>@ { props.owner.username }</span>
        <span className='datetime'>{ props.timestamp }</span>
      </header>
      <Message {...props} />
    </Block>
  </Flex>
)

export class InputBox extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {text: ''}
  }
  handleEnterKeyDown(event) {
    if (!event.shiftKey) {
      event.preventDefault()
      console.log(`Will send message ${this.state.text}`)
      this.setState({text: ''})
    }
  }
  handleChange(event) {
    this.setState({text: event.target.value})
  } 
  render() {
    return (
      <Flex className='input-box' margin='0 16px 16px 16px' padding='0px 12px' border='2px solid #d9d9d9' borderRadius={5}>
        <TextField multiLine={true} fullWidth={true} underlineShow={false} rowsMax={8}
          hintText='Say something Im giving up on you' 
          value={this.state.text}
          onChange={this.handleChange.bind(this)}
          onEnterKeyDown={this.handleEnterKeyDown.bind(this)} />
      </Flex>
    )
  }
}
