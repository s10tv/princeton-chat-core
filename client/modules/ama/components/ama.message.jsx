import React from 'react'
import moment from 'moment'
import {AvatarInputBox} from './ama.details.jsx'
import {UserAvatar} from '/client/lib/helpers.jsx'

export const Message = ({ currentUser, message, isReply, upVote, fields, handleSubmit,
  submitting, error }) => {
  const form = {
    handleSubmit,
    submitting,
    error,
    fields
  }

  return (
    <MessageContainer message={message} user={message.owner} isReply={isReply}>
      <MessageFooter message={message} upVote={upVote} />

      <AvatarInputBox avatar={currentUser.avatar}
        avatarInitials={currentUser.avatarInitials}
        placeholder={`Ask ${currentUser.displayName} a question...`}
        form={form} />
    </MessageContainer>
  )
}

const MessageFooter = ({ message, upVote }) => (
  <div className='ama-message-footer'>
    <a className='footer-component' onClick={(event) => {
      event.preventDefault()
      upVote(message)
    }}>
      <i className='fa fa-angle-up fa-lg footer-icon' />
      <span className='footer-text'>{message.upvotedUsers ? message.upvotedUsers.length : 0}</span>
    </a>
    <a className='footer-component'>
      <i className='fa fa-reply footer-icon' />
      <span className='footer-text'>Reply</span>
    </a>
    <a className='footer-component'>
      <i className='fa fa-facebook footer-icon' />
      <span className='footer-text'>Share</span>
    </a>
  </div>
)

const MessageContainer = ({ message, user, children, isSpeaker, isReply }) => (
  <div className={`ama-message-container ${isReply ? 'ama-message-container-reply' : ''}`}>
    <UserAvatar avatar={user.avatar} avatarInitials={user.avatarInitials} size={40} />
    <div className='message-content-container'>
      <div className='message-content-header'>
        <div>
          <span className={isSpeaker ? 'ama-highlighted-textbox' : 'message-author'}>{user.displayName}</span>
          <span className='message-author-desc'>-vc at rre ventures</span>
        </div>
        {isSpeaker ? null
          : <span className='message-timestamp'>{moment(message.createdAt).format('h:mm a')}</span>}
      </div>
      <p className='message-content'>{message.content}</p>
      {children}
    </div>
  </div>
)
