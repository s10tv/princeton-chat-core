import React from 'react'
import {UserAvatar} from '/client/lib/helpers.jsx'
import TextareaAutosize from 'react-textarea-autosize'

export const AvatarInputBox = (props) => {
  const { avatar, avatarInitials, placeholder, handleSubmit, fields } = props
  return (
    <div className='ama-avatar-inputbox-container'>
      <UserAvatar avatar={avatar} avatarInitials={avatarInitials} size={40} />
      <form className='ama-inputbox-form' onSubmit={handleSubmit((data) => {
        props.handleNewMessage(data, props.messageOptions)
      })}>
        <TextareaAutosize type='text' minRows={1} maxRows={5}
          className='form-control ama-inputbox' placeholder={placeholder} {...fields.content}/>
        {fields.content.value
          ? <button type='submit' className='btn btn-primary ama-inputbox-submit'>Submit</button>
          : null}
      </form>
    </div>
  )
}
