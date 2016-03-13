import React, {PropTypes} from 'react'
import {UserAvatar, TextareaAutosizeWrapper} from '/client/lib/helpers.jsx'

export const AvatarInputBox = (props) => {
  const { avatar, avatarInitials, placeholder, handleSubmit, fields: {content} } = props
  return (
    <div className='ama-avatar-inputbox-container'>
      <UserAvatar avatar={avatar} avatarInitials={avatarInitials} size={40} />
      <form className='ama-inputbox-form' onSubmit={handleSubmit((data) => {
        props.handleNewMessage(data, props.messageOptions)
      })}>
        <TextareaAutosizeWrapper autoFocusCursorAtEnd type='text' minRows={1} maxRows={5}
          className='form-control ama-inputbox' placeholder={placeholder}
          {...content} />
        {content.value
          ? <button type='submit' className='btn btn-primary ama-inputbox-submit'>Submit</button>
          : null}
      </form>
    </div>
  )
}

AvatarInputBox.propTypes = {
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
}
