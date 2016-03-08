import React from 'react'
import {MessageContainer} from './ama.details.jsx'
import AvatarInputBox from '../containers/ama.avatarinputbox.js'
import {AMA_REPLY_FORM_NAME} from '/client/configs/constants'

export const Message = ({ currentUser, message, isReply, upVote, fields, reply,
  openReplyBox, isReplyBoxOpen, submitting, handleSubmit, error, isUpvoted, amaPostId}) => {
  return (
    <MessageContainer message={message} user={message.owner} isReply={isReply}>
      <MessageFooter isUpvoted={isUpvoted} message={message} upVote={upVote} openReplyBox={openReplyBox} />

      {!isReplyBoxOpen
        ? null
        : <AvatarInputBox avatar={currentUser.avatar}
          avatarInitials={currentUser.avatarInitials}
          placeholder={`Reply to ${message.owner.displayName}...`}
          amaPostId={amaPostId}
          message={message}
          formType={AMA_REPLY_FORM_NAME}
          handleNewMessage={reply}
          messageOptions={{ parentMessageId: message._id }} />
      }
    </MessageContainer>
  )
}

const MessageFooter = ({ message, upVote, isUpvoted, openReplyBox }) => (
  <div className='ama-message-footer'>
    <a className={`footer-component${isUpvoted ? ' upvoted' : ''}`} onClick={(event) => {
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
