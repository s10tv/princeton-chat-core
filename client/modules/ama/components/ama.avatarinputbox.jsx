import React, {PropTypes} from 'react'
import {UserAvatar} from '/client/lib/helpers.jsx'
import TextareaAutosize from 'react-textarea-autosize'

export const AvatarInputBox = React.createClass({
  propTypes: {
    avatar: PropTypes.object.isRequired,
    avatarInitials: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    fields: PropTypes.shape({
      content: PropTypes.object.isRequired,
      amaPostId: PropTypes.object.isRequired
    }).isRequired,
    handleNewMessage: PropTypes.func.isRequired,
    messageOptions: PropTypes.object
  },

  componentDidMount () {
    this.refs.input.focus()
    const val = this.refs.input.value
    if (val) {
      this.refs.input.value = ''
      this.refs.input.value = val
    }
  },

  render () {
    const { avatar, avatarInitials, placeholder, handleSubmit, fields } = this.props
    return (
      <div className='ama-avatar-inputbox-container'>
        <UserAvatar avatar={avatar} avatarInitials={avatarInitials} size={40} />
        <form className='ama-inputbox-form' onSubmit={handleSubmit((data) => {
          this.props.handleNewMessage(data, this.props.messageOptions)
        })}>
          <TextareaAutosize ref='input' type='text' minRows={1} maxRows={5}
            className='form-control ama-inputbox' placeholder={placeholder}
            {...fields.content} />
          {fields.content.value
            ? <button type='submit' className='btn btn-primary ama-inputbox-submit'>Submit</button>
            : null}
        </form>
      </div>
    )
  }
})
