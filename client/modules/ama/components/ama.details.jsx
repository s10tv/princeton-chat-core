import React, {PropTypes} from 'react'
import {imageShape, userShape} from '/client/lib/shapes'
import Radium, {StyleRoot} from 'radium'
import {FontIcon} from '/client/lib/ui.jsx'
import moment from 'moment'
import {UserAvatar} from '/client/lib/helpers.jsx'
import {spacing} from '/client/configs/theme'
import TextareaAutosize from 'react-textarea-autosize'
import Divider from 'material-ui/lib/divider'
import Message from '/client/modules/ama/containers/ama.message'

class AMADetails extends React.Component {

  // temporary
  componentWillMount () {
    document.body.style.overflow = 'auto'
  }

  componentWillUnmount () {
    document.body.style.overflow = 'hidden'
  }

  render () {
    console.log(this.props)
    return (
      <StyleRoot>
        <div className='ama-page-wrapper'>
          <div className='ama-main'>
            <Header {...this.props} />
            <div className='ama-content'>
              <AmaMain {...this.props} />
              <AmaActivities {...this.props} />
            </div>
          </div>
        </div>
      </StyleRoot>
    )
  }
}

AMADetails.propTypes = {
  currentUser: userShape.isRequired,
  isLive: PropTypes.bool.isRequired,
  cover: imageShape.isRequired,
  title: PropTypes.string.isRequired,
  introText: PropTypes.string.isRequired,
  speakerTagline: PropTypes.string,
  speaker: userShape.isRequired,
  speakerIsTyping: PropTypes.bool.isRequired,
  participants: PropTypes.arrayOf(userShape).isRequired,
  startTime: PropTypes.object.isRequired,
  activities: PropTypes.arrayOf(PropTypes.shape({
    isMine: PropTypes.bool.isRequired,
    owner: userShape.isRequired,
    message: PropTypes.shape({
      _id: PropTypes.string.isRequired
    }),
    createdAt: PropTypes.object.isRequired
  })),

  // actions
  handleSubmit: PropTypes.func.isRequired, // ask question
  showMenu: PropTypes.func.isRequired,
  twitterShare: PropTypes.func.isRequired,
  reply: PropTypes.func.isRequired,
  fbShareMessage: PropTypes.func.isRequired,
  upVote: PropTypes.func.isRequired,
  toggleFeedFilter: PropTypes.func.isRequired
}

const Header = (props) => {
  return (
    <div className='ama-header' style={{backgroundImage: `url(${props.cover.url})`}}>
      <HeaderInnerDiv {...props}/>
      <HeaderOverlay {...props}/>
    </div>
  )
}

const HeaderInnerDiv = (props) => {
  return (
    <div className='ama-header-inner'>
      <div className='header-details-container'>
        <div className='header-date-container'>
          <span>{moment(props.startTime).format('MMM D').toUpperCase()}</span>
          <span>{moment(props.startTime).format('ha')}</span>
        </div>
        {props.isLive ? <LiveNow /> : null}
        <span className='header-conversation-label'>{props.title}</span>
      </div>
    </div>
  )
}

const HeaderOverlay = (props) => {
  return (
    <div className='ama-header-overlay'>
      <div className='overlay-row'>
        <span className='overlay-row-label'>Share</span>
        <div className='overlay-content-row share-buttons-row'>
          <button type='button' className='btn btn-twitter ama-button-share'>
            <i className='fa fa-twitter fa-lg'/>
          </button>
          <button type='button' className='btn btn-facebook ama-button-share'>
            <i className='fa fa-facebook fa-lg'/>
          </button>
        </div>
      </div>
      <div className='overlay-row'>
        <span className='overlay-row-label'>Participants ({props.participants.length})</span>
        <div className='overlay-content-row participants-row'>
          {props.participants.map((participant) =>
            <UserAvatar
              key={participant._id}
              avatar={participant.avatar}
              avatarInitials={participant.avatarInitials}
              size={30}
              style={{marginRight: spacing.x2}}/>
          )}
        </div>
      </div>
    </div>
  )
}

const LiveNow = (props) => (
  <div className='ama-live-now-container'>
    <div className='live-now-circle'/>
    <span className='live-now-label'>LIVE NOW</span>
  </div>
)

const AmaMain = (props) => {
  const form = {
    handleSubmit: props.handleSubmit,
    submitting: props.submitting,
    error: props.error,
    fields: props.fields
  }

  return (
    <div className='ama-activity-main-content'>
      <div className='top-labels-container'>
        <span className='top-label'>Discussion</span>
        <span className='top-label'>Top v</span>
      </div>
      <PostMessage speaker={props.speaker} introText={props.introText} form={{
        handleSubmit: props.handleSubmit,
        submitting: props.submitting,
        error: props.error,
        fields: props.fields
      }} />
      <Divider style={{marginTop: spacing.x15, marginBottom: spacing.x15,
          marginLeft: spacing.x3, marginRight: spacing.x3}} />
      {props.messages.map((message) =>
        <div key={message._id}>
          <Message message={message} {...props} form={form} />
          {message.replies.map((reply) => <Message key={reply._id} message={reply}
            isReply form={form} {...props} />)}
        </div>
      )}
    </div>
  )
}

const PostMessage = ({ speaker, introText, form }) => (
  <MessageContainer message={{content: introText}} user={speaker} isSpeaker>
    <AvatarInputBox avatar={speaker.avatar} avatarInitials={speaker.avatarInitials}
      placeholder={`Ask ${speaker.displayName} a question...`}
      form={form} />
  </MessageContainer>
)

export const AvatarInputBox = ({ avatar, avatarInitials, placeholder, form }) => (
  <div className='ama-avatar-inputbox-container'>
    <UserAvatar avatar={avatar} avatarInitials={avatarInitials} size={40} />
    <form className='ama-inputbox-form' onSubmit={form.handleSubmit}>
      <TextareaAutosize type='text' minRows={1} maxRows={5}
        className='form-control ama-inputbox' placeholder={placeholder} {...form.fields.content}/>
      <button type='submit' className='btn btn-primary ama-inputbox-submit'>Submit</button>
    </form>
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

const AmaActivities = (props) => (
  <div className='ama-activity-sidebar'>
    {!props.speakerIsTyping ? null : (
      <SpeakerIsTyping {...props} />
    )}

    {props.activities.map((activity) => (
      <AmaActivity key={activity._id} activity={activity} {...props} />
    ))}
  </div>
)

const SpeakerIsTyping = (props) => {
  return (
    <div className='ama-host-is-typing' key='speaker-typing'>
      <div className='ama-activity-avatar'>
        <UserAvatar
          avatar={props.speaker.avatar}
          avatarInitials={props.speaker.avatarInitials} />
      </div>
      <div>
        <span className='ama-highlighted-textbox'>
          {props.speaker.firstName}
        </span>
        <span className='ama-speaker-is-typing'>is typing ... </span>
      </div>
    </div>
  )
}

const AmaActivity = ({activity}) => (
  <div className='ama-activity' key={activity._id}>
    <div className='ama-activity-header'>
      <div className='ama-activity-avatar'>
        <UserAvatar
          avatar={activity.owner.avatar}
          avatarInitials={activity.owner.avatarInitials} />
      </div>
      <div className='ama-activity-owner-info'>
        <div className='ama-activity-owner-displayName'>{activity.owner.displayName}</div>

        <div className='ama-activity-timestamp'>
          <span>{moment(activity.createdAt).format('MMM D').toUpperCase()}</span>
        </div>
      </div>
    </div>
    <div className='ama-activity-content'>
      {activity.content}
    </div>
  </div>
)

export default Radium(AMADetails)
