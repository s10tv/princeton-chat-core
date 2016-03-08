import React from 'react'
import {AvatarInputBox, MessageContainer} from './ama.details.jsx'

export const Message = ({ currentUser, message, isReply, upVote, fields, reply,
  openReplyBox, isReplyBoxOpen, submitting, handleSubmit, error}) => {
  const form = {
    handleSubmit,
    submitting,
    error,
    fields
  }

  return (
    <MessageContainer message={message} user={message.owner} isReply={isReply}>
      <MessageFooter message={message} upVote={upVote} openReplyBox={openReplyBox} />

      {!isReplyBoxOpen
        ? null
        : <AvatarInputBox avatar={currentUser.avatar}
          avatarInitials={currentUser.avatarInitials}
          placeholder={`Ask ${currentUser.displayName} a question...`}
          form={form}
          handleNewMessage={reply}
          messageOptions={{ parentMessageId: message._id }} />
      }
    </MessageContainer>
  )
}

const MessageFooter = ({ message, upVote, openReplyBox }) => (
  <div className='ama-message-footer'>
    <a className='footer-component' onClick={(event) => {
      event.preventDefault()
      upVote(message)
    }}>
      <i className='fa fa-angle-up fa-lg footer-icon' />
      <span className='footer-text'>{message.upvotedUsers ? message.upvotedUsers.length : 0}</span>
    </a>
    <a className='footer-component' onClick={() => openReplyBox(message._id)}>
      <i className='fa fa-reply footer-icon' />
      <span className='footer-text'>Reply</span>
    </a>
    <a className='footer-component'>
      <i className='fa fa-facebook footer-icon' />
      <span className='footer-text'>Share</span>
    </a>
  </div>
)
