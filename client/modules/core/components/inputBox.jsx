import React from 'react'
import { Flex, Inline } from 'jsxstyle'
import RaisedButton from '../../../../node_modules/material-ui/lib/raised-button'
import Checkbox from '../../../../node_modules/material-ui/lib/checkbox'
import linkState from 'react-link-state'
import { LetterAvatar, CoverAvatar } from '/client/modules/core/components/helpers.jsx'
import MyAutoComplete from '/client/lib/mention.textfield.jsx'

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
    fields: React.PropTypes.shape({
      content: React.PropTypes.object.isRequired
    }),
    parseAndFetchMentions: React.PropTypes.func.isRequired,
    mentions: React.PropTypes.object.isRequired,
    /**
     * The function called to create a message.
     */
    create: React.PropTypes.func.isRequired
  },

  getInitialState () {
    return {
      followToggleMouseOver: false,
      inputFocused: false,
      pressEnterToSend: true,
      showFocusControls: false,
      sendButtonDisabled: true
    }
  },

  sendMessage () {
    const message = this.props.fields.content.value || ''

    if (message.length === 0) {
      return this.props.showSnackbarError('To add a newline, press [Shift] with [Enter]')
    }

    if (message.trim().length === 0) {
      return this.props.showSnackbarError('Until everyone can communicate through whitespace, please input some text :)')
    }

    this.props.create(message, this.props.postId)
    this.setState({
      showFocusControls: false
    })

    this.props.fields.content.onChange('')
  },

  handleEnterKeyDown (event) {
    if (!event.shiftKey && this.state.pressEnterToSend) {
      event.preventDefault()
      this.sendMessage()
    }
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
          : <RaisedButton disabled={this.props.fields.content.value === undefined}
            label='Send'
            primary
            onTouchTap={this.sendMessage} />}
      </Flex>
    )
  },

  render () {
    const {fields: {content}, fetchMentions, mentions, clearMentions, replaceWithMention} = this.props

    return (
      <Flex component='footer' flexDirection='column' padding='0 16px 8px 16px' flexShrink='0'>
        <Flex
          className='input-box'
          padding='0px 12px'
          border='2px solid #d9d9d9'
          borderRadius={5}>

          <MyAutoComplete
            ref='inputbox'
            multiLine
            fullWidth
            clearTextOnEnter={this.state.pressEnterToSend}
            underlineShow={false}
            rowsMax={8}
            hintText='Type a message...'
            fetchMentions={fetchMentions}
            onBlur={this.handleInputBlur}
            onEnterKeyDown={this.handleEnterKeyDown}
            mentions={mentions.content}
            clearMentions={() => clearMentions(content)}
            onMentionTap={(user) => replaceWithMention(content, user)}
            {...content}
            onChange={(e) => {
              const msg = e.target.value
              this.props.parseAndFetchMentions(content, msg)
              content.onChange(e)
            }}
            />
        </Flex>
        {content.value ? this.renderInputControls() : this.renderFollowerControls()}
      </Flex>
    )
  }
})
