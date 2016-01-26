import React from 'react'
import {Flex} from 'jsxstyle'
import TextField from 'material-ui/lib/text-field'

class InputBox extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {text: ''}
  }

  handleEnterKeyDown(event) {
    if (!event.shiftKey) {
      event.preventDefault();
      this.props.create(this.state.text, this.props.postId);
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

InputBox.propTypes = {
  postId: React.PropTypes.string.isRequired,
  create: React.PropTypes.func.isRequired,
};

export default InputBox;
