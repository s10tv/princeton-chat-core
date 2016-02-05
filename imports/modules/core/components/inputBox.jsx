import React from 'react'
import {Flex, Inline} from 'jsxstyle'
import TextField from 'material-ui/lib/text-field'
import Avatar from 'material-ui/lib/avatar'
import RaisedButton from 'material-ui/lib/raised-button'
import Checkbox from 'material-ui/lib/checkbox'

export default class InputBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '', 
      followToggleMouseOver: false,
      inputFocused: false,
    }
  }
  
  handleEnterKeyDown(event) {
    if (!event.shiftKey) {
      event.preventDefault();
      this.props.create(this.state.text, this.props.postId);
      this.setState({text: ''})
    }
  }
  
  handleInputBlur() {
    this.setState({inputFocused: false})
  }
  
  handleInputFocus() {
    this.setState({inputFocused: true})
  }

  handleChange(event) {
    this.setState({text: event.target.value})
  }
  
  handleFollowToggleClick(e) {
    e.preventDefault()
    this.props.isFollowing ? this.props.unfollow() : this.props.follow()
  }
  
  handleFollowToggleMouseOver() {
    this.setState({followToggleMouseOver: true})
  }
  
  handleFollowToggleMouseOut() {
    this.setState({followToggleMouseOver: false})
  }
  
  renderFollowerControls() {
    return (
      <Flex alignItems='center' marginTop='12px' height={30}>
        <Inline component='span' marginRight='8px'>
          { this.props.followers.length > 0
            ? (this.props.followers.length > 1 ? 'Followers:' : 'Follower:')
            : 'No followers'
          }
        </Inline>
        {this.props.followers.map(user =>
          <Avatar key={user._id} style={{width: 30, height: 30}} src={user.avatar.url} />
        )}
        <Flex marginLeft='auto'>
          <a style={{cursor: 'pointer'}}
            onClick={this.handleFollowToggleClick.bind(this)}
            onMouseOver={this.handleFollowToggleMouseOver.bind(this)}
            onMouseOut={this.handleFollowToggleMouseOut.bind(this)} >
            { this.props.isFollowing 
              ? (this.state.followToggleMouseOver ? 'Unfollow' : 'Following')
              : 'Follow' }
          </a>
        </Flex>
      </Flex>
    )
  }
  
  renderInputControls() {
    return (
      <Flex alignItems='center' marginTop='12px' height={30}>
        {this.props.followers.map(user =>
          <Avatar key={user._id} style={{width: 30, height: 30}} src={user.avatar.url} />
        )}
        <Inline component='span' marginLeft='8px' marginRight='auto'>
          { this.props.followers.length > 0
            ? 'will be notified'
            : 'No one will be notified' }
        </Inline>
        <Checkbox label='Press enter to send' style={{maxWidth: 210}} />
        <RaisedButton label='Send' primary={true} />
      </Flex>
    )
  }
  
  render() {
    const showInputControls = this.state.inputFocused || this.state.text.length > 0
    return (
      <Flex component='footer' flexDirection='column' padding='0 16px 8px 16px'>
        <Flex className='input-box' padding='0px 12px' border='2px solid #d9d9d9' borderRadius={5}>
          <TextField multiLine={true} fullWidth={true} underlineShow={false} rowsMax={8}
            hintText='Type a message...'
            value={this.state.text}
            onChange={this.handleChange.bind(this)}
            onBlur={this.handleInputBlur.bind(this)}
            onFocus={this.handleInputFocus.bind(this)}
            onEnterKeyDown={this.handleEnterKeyDown.bind(this)} />
        </Flex>
        { showInputControls ? this.renderInputControls() : this.renderFollowerControls() }
      </Flex>
    )
  }
}

InputBox.propTypes = {
  /**
   * The post which this message will be created for.
   */
  postId: React.PropTypes.string.isRequired,
  followers: React.PropTypes.array.isRequired,
  isFollowing: React.PropTypes.bool.isRequired,
  follow: React.PropTypes.func.isRequired,
  unfollow: React.PropTypes.func.isRequired,
  /**
   * The function called to create a message.
   */
  create: React.PropTypes.func.isRequired,
}
