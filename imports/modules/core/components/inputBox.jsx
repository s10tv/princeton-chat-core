import React from 'react'
import {Flex} from 'jsxstyle'
import TextField from 'material-ui/lib/text-field'

export default React.createClass({
  propTypes: {
    /**
     * The post which this message will be created for.
     */
    postId: React.PropTypes.string.isRequired,

    /**
     * The function called to create a message.
     */
    create: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {text: ''}
  },

  handleEnterKeyDown(event) {
    if (!event.shiftKey) {
      event.preventDefault();
      this.props.create(this.state.text, this.props.postId);
      this.setState({text: ''})
    }
  },

  handleChange(event) {
    this.setState({text: event.target.value})
  },

  render() {
    return (
      <Flex className='input-box' margin='0 16px 16px 16px' padding='0px 12px' border='2px solid #d9d9d9' borderRadius={5}>
        <TextField multiLine={true} fullWidth={true} underlineShow={false} rowsMax={8}
          hintText='Type a message...'
          value={this.state.text}
          onChange={this.handleChange.bind(this)}
          onEnterKeyDown={this.handleEnterKeyDown.bind(this)} />
      </Flex>
    )
  }
})
