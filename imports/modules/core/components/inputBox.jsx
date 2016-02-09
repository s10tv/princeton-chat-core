import React from 'react'
import {Flex, Inline} from 'jsxstyle'
import TextField from 'material-ui/lib/text-field'
import Avatar from 'material-ui/lib/avatar'
import RaisedButton from 'material-ui/lib/raised-button'
import Checkbox from 'material-ui/lib/checkbox'
import linkState from 'react-link-state'

export default class InputBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      followToggleMouseOver: false,
      inputFocused: false,
      pressEnterToSend: true,
    }
  }

  sendMessage() {
    this.props.create(this.state.text, this.props.postId)
    this.setState({text: ''})
  }

  handleEnterKeyDown(event) {
    if (!event.shiftKey && this.state.pressEnterToSend) {
      event.preventDefault()
      this.sendMessage()
    }
  }

  handleInputBlur() {
    this.setState({inputFocused: false})
  }

  handleInputFocus() {
    this.setState({inputFocused: true})
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
          <a href='#'
            onClick={() => this.props.showPostFollowers(this.props.post.followers)}
            style={{display: 'flex', alignItems: 'center'}}>
            <Inline component='span' marginRight='8px'>
              { this.props.followers.length > 0
                ? (this.props.followers.length > 1 ? 'Followers:' : 'Follower:')
                : 'No followers'
              }
            </Inline>
            {this.props.followers.map(user =>
              <Avatar key={user._id} style={{width: 30, height: 30}} src={user.avatar.url} />
            )}
          </a>
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
        <Checkbox checkedLink={linkState(this, 'pressEnterToSend')} label='Press enter to send' style={{maxWidth: 210}} />
        { this.state.pressEnterToSend ? null
          : <RaisedButton disabled={this.state.text.length == 0} label='Send' primary={true} onTouchTap={this.sendMessage.bind(this)} /> }
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
            onChange={(e) => this.setState({text: e.target.value})}
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
  post: React.PropTypes.object.isRequired,
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
