import React from 'react'
import ReactDOM from 'react-dom'
import { Flex, Inline } from 'jsxstyle'
import TextField from '../../../../node_modules/material-ui/lib/text-field'
import RaisedButton from '../../../../node_modules/material-ui/lib/raised-button'
import Checkbox from '../../../../node_modules/material-ui/lib/checkbox'
import linkState from 'react-link-state'
import UserService from '/lib/user.service'
import { LetterAvatar, CoverAvatar } from '/client/modules/core/components/helpers.jsx'
import {Paper, List, ListItem} from '/client/lib/ui.jsx'

export const MentionAssist = (props) => {
  const user = props.user
  const avatar = user.avatar.isDefaultAvatar
    ? <LetterAvatar key={user._id} style={{marginRight: 3}} color='white'
      backgroundColor={user.avatar.color}>
      {user.avatarInitials}
    </LetterAvatar>
    : <CoverAvatar key={user._id} style={{marginRight: 3}} src={user.avatar.url} />

  const display = `${user.username} (${user.displayName})`

  return (
    <ListItem
      primaryText={display}
      leftAvatar={avatar}
      onTouchTap={() => props.updateCurrentWordWith(user.username)} />
  )
}

export default React.createClass({
  propTypes: {
    /**
     * The post which this message will be created for.
     */
    post: React.PropTypes.object.isRequired,
    postId: React.PropTypes.string.isRequired,
    followers: React.PropTypes.array.isRequired,
    isFollowing: React.PropTypes.bool.isRequired,
    follow: React.PropTypes.func.isRequired,
    unfollow: React.PropTypes.func.isRequired,
    showSnackbarError: React.PropTypes.func.isRequired,
    showPostFollowers: React.PropTypes.func.isRequired,
    fetchMentions: React.PropTypes.func.isRequired,
    /**
     * The function called to create a message.
     */
    create: React.PropTypes.func.isRequired
  },

  getInitialState () {
    return {
      text: '',
      isMentionBoxOpen: false,
      followToggleMouseOver: false,
      inputFocused: false,
      pressEnterToSend: true,
      mentions: []
    }
  },

  sendMessage () {
    this.props.create(this.state.text, this.props.postId)
    this.setState({
      text: '',
      isMentionBoxOpen: false,
      mentions: []
    })
  },

  handleEnterKeyDown (event) {
    if (!event.shiftKey && this.state.pressEnterToSend) {
      event.preventDefault()

      if (this.state.text.length === 0) {
        return this.props.showSnackbarError('To add a newline, press [Shift] with [Enter]')
      }

      if (this.state.text.trim().length === 0) {
        return this.props.showSnackbarError('Until everyone can communicate through whitespace, please input some text :)')
      }

      this.sendMessage()
    }
  },

  updateCurrentWordWith (text) {
    const words = this.state.text.split(' ').filter((word) => word.length > 0)
    if (words.length === 0) {
      return this.setState({ isMentionBoxOpen: false })
    }

    // replace last element with auto completed
    words.pop()
    words.push(`@${text} `)

    this.setState({ text: words.join(' ') })

    // this doesn't wokr for some reason
    ReactDOM.findDOMNode(this.refs.messagebox).focus()
    document.getElementById('messagebox').focus()

    return this.setState({ isMentionBoxOpen: false })
  },

  checkForMention (text) {
    const words = text.split(' ').filter((word) => word.length > 0)

    // text area is empty or all spaces
    if (words.length === 0) {
      return this.setState({ isMentionBoxOpen: false })
    }

    const lastWord = words[words.length - 1]
    if (lastWord.charAt(0) === '@' && lastWord.length > 1) {
      return this.props.fetchMentions(lastWord.substring(1), (results) => {
        if (results.length > 0) {
          this.setState({
            isMentionBoxOpen: true,
            mentions: results.map((user) => UserService.getUserView(user))
          })
        }
      })
    }

    this.setState({ isMentionBoxOpen: false })
  },

  handleInputBlur () {
    this.setState({inputFocused: false})
  },

  handleInputFocus () {
    this.setState({inputFocused: true})
  },

  handleFollowToggleClick (e) {
    e.preventDefault()
    this.props.isFollowing ? this.props.unfollow() : this.props.follow()
  },

  handleFollowToggleMouseOver () {
    this.setState({followToggleMouseOver: true})
  },

  handleFollowToggleMouseOut () {
    this.setState({followToggleMouseOver: false})
  },

  renderFollowerControls () {
    return (
      <Flex alignItems='center' marginTop='12px' height={30}>
        <Flex alignItems='center'
          onTouchTap={() => this.props.showPostFollowers(this.props.post.followers)}>
          <Inline component='span' marginRight='8px' fontWeight={300}>
            {this.props.followers.length > 0
              ? (this.props.followers.length > 1 ? 'Followers:' : 'Follower:')
              : 'No followers'}
          </Inline>
          {this.props.followers.map((user) => user.avatar.isDefaultAvatar
            ? <LetterAvatar key={user._id} style={{marginRight: 3}} size={30} color='white'
              backgroundColor={user.avatar.color}>
              {user.avatarInitials}
            </LetterAvatar>
            : <CoverAvatar key={user._id} style={{marginRight: 3}} size={30} src={user.avatar.url} />
          )}
        </Flex>
        <Flex marginLeft='auto'>
          <a
            style={{cursor: 'pointer', fontWeight: 300}}
            onClick={this.handleFollowToggleClick}
            onMouseOver={this.handleFollowToggleMouseOver}
            onMouseOut={this.handleFollowToggleMouseOut}>
            {this.props.isFollowing
               ? (this.state.followToggleMouseOver ? 'Unfollow' : 'Following')
               : 'Follow'}
          </a>
        </Flex>
      </Flex>
    )
  },

  renderInputControls () {
    return (
      <Flex alignItems='center' marginTop='12px' height={30}>
        {this.props.followers.map((user) => user.avatar.isDefaultAvatar
          ? <LetterAvatar key={user._id} size={30} style={{marginRight: 3}} color='white'
            backgroundColor={user.avatar.color}>
            {user.avatarInitials}
          </LetterAvatar>
          : <CoverAvatar key={user._id} style={{marginRight: 3}} size={30} src={user.avatar.url} />
        )}
        <Inline component='span' marginLeft='8px' marginRight='auto' fontWeight={300}>
          {this.props.followers.length > 0
             ? 'will be notified'
             : 'No one will be notified'}
        </Inline>
        <Checkbox checkedLink={linkState(this, 'pressEnterToSend')} label='Press enter to send'
          style={{maxWidth: 210, fontWeight: 300}} />
        {this.state.pressEnterToSend
          ? null
          : <RaisedButton disabled={this.state.text.length === 0} label='Send' primary
            onTouchTap={this.sendMessage} />}
      </Flex>
    )
  },

  render () {
    const showInputControls = this.state.inputFocused || this.state.text.length > 0
    const mentionHelper = !this.state.isMentionBoxOpen
      ? null
      : <Paper zDepth={1} style={{
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
      }}>
        <List style={{paddingTop: 0, paddingBottom: 0}}>
          {this.state.mentions.map((mention) => (
            <MentionAssist
              key={mention._id}
              user={mention}
              updateCurrentWordWith={this.updateCurrentWordWith}/>
          ))}
        </List>
      </Paper>

    return (
      <Flex component='footer' flexDirection='column' padding='0 16px 8px 16px' flexShrink='0'>
        {mentionHelper}
        <Flex
          className='input-box'
          padding='0px 12px'
          border='2px solid #d9d9d9'
          style={{
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            borderTopLeftRadius: this.state.isMentionBoxOpen ? 0 : 5,
            borderTopRightRadius: this.state.isMentionBoxOpen ? 0 : 5
          }}
          borderRadius={5}>
          <TextField
            id='messagebox'
            ref='messagebox'
            multiLine
            fullWidth
            underlineShow={false}
            rowsMax={8}
            hintText='Type a message...'
            value={this.state.text}
            onChange={(e) => {
              this.setState({text: e.target.value})
              this.checkForMention(e.target.value)
            }}
            onBlur={this.handleInputBlur}
            onFocus={this.handleInputFocus}
            onEnterKeyDown={this.handleEnterKeyDown} />
        </Flex>
        {showInputControls ? this.renderInputControls() : this.renderFollowerControls()}
      </Flex>
    )
  }
})
