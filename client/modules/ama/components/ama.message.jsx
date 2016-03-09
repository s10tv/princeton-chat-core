import React from 'react'
import {MessageContainer} from './ama.details.jsx'
import AvatarInputBox from '../containers/ama.avatarinputbox.js'
import {AMA_REPLY_FORM_NAME} from '/client/configs/constants'
import {Element} from 'react-scroll'

export const Message = ({ currentUser, message, isReply, upVote, fields, reply,
  openReplyBox, isReplyBoxOpen, submitting, handleSubmit, error, isUpvoted, amaPostId,
  speaker, fbShare, isSpeaker, speakerTagLine, messageLinkOnClick, showUserProfile }) => {
  return (
    <Element className='ama-message-container-wrapper' name={message._id}>
      <MessageContainer message={message} user={message.owner} isReply={isReply}
        speakerTagLine={speakerTagLine} isSpeaker={isSpeaker}
        messageLinkOnClick={messageLinkOnClick} showUserProfile={showUserProfile}>
        <MessageFooter isUpvoted={isUpvoted}
          message={message}
          upVote={upVote}
          fbShare={fbShare}
          openReplyBox={openReplyBox} />

        {!isReplyBoxOpen
          ? null
          : <AvatarInputBox avatar={currentUser.avatar}
            avatarInitials={currentUser.avatarInitials}
            placeholder={`Reply to ${message.owner.displayName}...`}
            amaPostId={amaPostId}
            message={message}
            speaker={speaker}
            defaultValue={`@${message.owner.firstName}`}
            formType={AMA_REPLY_FORM_NAME}
            handleNewMessage={reply}
            messageOptions={{ parentMessageId: message._id }} />
        }
      </MessageContainer>
    </Element>
  )
}

const MessageFooter = ({ message, upVote, isUpvoted, openReplyBox, fbShare }) => (
  <div className='ama-message-footer'>
    <a className={`footer-component${isUpvoted ? ' upvoted' : ''}`} onClick={(event) => {
      event.preventDefault()
      upVote(message)
    }}>
      <i className='fa fa-angle-up fa-lg footer-icon' />
      <span className='footer-text'>{message.upvotedUsers ? message.upvotedUsers.length : 0}</span>
    </a>
    <a className='footer-component' onClick={() => openReplyBox(message)}>
      <i className='fa fa-reply footer-icon' />
      <span className='footer-text'>Reply</span>
    </a>
    <a className='footer-component' onClick={fbShare}>
      <i className='fa fa-facebook footer-icon' />
      <span className='footer-text'>Share</span>
    </a>
  </div>
)
