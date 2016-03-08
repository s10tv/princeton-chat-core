import React, {PropTypes} from 'react'
// import Transition from 'react-motion-ui-pack'
import Radium, {StyleRoot} from 'radium'
import TextareaAutosize from 'react-textarea-autosize'
import moment from 'moment'
import {imageShape, userShape} from '/client/lib/shapes'
import {UserAvatar} from '/client/lib/helpers.jsx'
import {spacing} from '/client/configs/theme'
import TimeAgo from 'react-timeago'
import Divider from 'material-ui/lib/divider'
import Message from '/client/modules/ama/containers/ama.message'

class AMADetails extends React.Component {

  // temporary
  componentWillMount () {
    document.body.style.overflow = 'auto'
    console.log(this.props)
  }

  componentWillUnmount () {
    document.body.style.overflow = 'hidden'
  }

  componentDidUpdate () {
    if (this.props.scrollToMsgId && document.getElementById(this.props.scrollToMsgId)) {
      const msgDOM = document.getElementById(this.props.scrollToMsgId)
      msgDOM.scrollIntoView(true)
      msgDOM.className = `${msgDOM.className} ama-message-container-animate`

      const removeAnimationClass = () => {
        msgDOM.className = msgDOM.className.replace(' ama-message-container-animate', '')
      }
      // http://stackoverflow.com/questions/6186454/is-there-a-callback-on-completion-of-a-css3-animation
      msgDOM.addEventListener('webkitAnimationEnd', removeAnimationClass)
      msgDOM.addEventListener('animationEnd', removeAnimationClass)
      msgDOM.addEventListener('oanimationEnd', removeAnimationClass)
      this.props.clearScrollToMsgId()
    }
  }

  render () {
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
  speakerIsTyping: PropTypes.bool,
  participants: PropTypes.arrayOf(userShape).isRequired,
  participantCount: PropTypes.number.isRequired,
  startTime: PropTypes.object.isRequired,
  activities: PropTypes.arrayOf(PropTypes.shape({
    isMine: PropTypes.bool.isRequired,
    owner: userShape.isRequired,
    message: PropTypes.shape({
      _id: PropTypes.string.isRequired
    }),
    createdAt: PropTypes.object.isRequired
  })),
  scrollToMsgId: PropTypes.string,
  clearScrollToMsgId: PropTypes.func.isRequired,

  // actions
  askQuestion: PropTypes.func.isRequired,
  showMenu: PropTypes.func.isRequired,
  twitterShare: PropTypes.func.isRequired,
  reply: PropTypes.func.isRequired,
  fbShareMessage: PropTypes.func.isRequired,
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
        <span className='overlay-row-label'>Participants ({props.participantCount})</span>
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
        <span className='top-label'>Discussion</span> {/* TODO: add top/recent afterwards */}
      </div>
      <PostMessage currentUser={props.currentUser}
        speaker={props.speaker}
        introText={props.introText}
        form={form}
        handleNewMessage={props.askQuestion}
        scrollToBottom={props.scrollToBottom} />
      <Divider style={{marginTop: spacing.x15, marginBottom: spacing.x15,
          marginLeft: spacing.x3, marginRight: spacing.x3}} />
      {props.messages.map((message) =>
        <div key={message._id}>
          <Message message={message} currentUser={props.currentUser}
            amaPostId={props.params.amaPostId} />
          {message.replies.map((reply) => <Message key={reply._id} message={reply}
            isReply currentUser={props.currentUser} amaPostId={props.params.amaPostId} />)}
        </div>
      )}
    </div>
  )
}

const PostMessage = ({ currentUser, speaker, introText, form, handleNewMessage }) => (
  <MessageContainer message={{content: introText}} user={speaker} isSpeaker>
    <AvatarInputBox avatar={currentUser.avatar} avatarInitials={currentUser.avatarInitials}
      placeholder={`Ask ${speaker.displayName} a question...`}
      handleNewMessage={handleNewMessage}
      form={form} />
  </MessageContainer>
)

export const AvatarInputBox = React.createClass({
  propTypes: {
    avatar: PropTypes.object.isRequired,
    avatarInitials: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
    messageOptions: PropTypes.object,
    handleNewMessage: PropTypes.func.isRequired
  },

  render () {
    const { avatar, avatarInitials, placeholder, form } = this.props
    return (
      <div className='ama-avatar-inputbox-container'>
        <UserAvatar avatar={avatar} avatarInitials={avatarInitials} size={40} />
        <form className='ama-inputbox-form' onSubmit={form.handleSubmit((data) => {
          this.props.handleNewMessage(data, this.props.messageOptions)
        })}>
          <TextareaAutosize type='text' minRows={1} maxRows={5}
            className='form-control ama-inputbox' placeholder={placeholder} {...form.fields.content}/>
          {form.fields.content.value
            ? <button type='submit' className='btn btn-primary ama-inputbox-submit'>Submit</button>
            : null}
        </form>
      </div>
    )
  }
})

export const MessageContainer = ({ message, user, children, isSpeaker, isReply }) => (
  <div id={message._id}
    className={`ama-message-container${isReply ? ' ama-message-container-reply' : ''}`}>
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
      <p className={`message-content${isSpeaker ? ' message-content-no-bot-margin' : ''}`}>{message.content}</p>
      {children}
    </div>
  </div>
)

const AmaActivities = (props) => (
  <div className='ama-activity-sidebar' style={props.style}>
      {!props.speakerIsTyping ? null : (
        <SpeakerIsTyping key='speaker-typing' {...props} />
      )}
      {props.activities.map((activity) => (
        <AmaActivity key={activity._id} activity={activity} {...props} />
      ))}
  </div>
)

const SpeakerIsTyping = (props) => {
  return (
    <div className='ama-host-is-typing' style={props.style}>
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

const AmaActivity = ({activity, style}) => (
  <div className='ama-activity' style={style}>
    <div className='ama-activity-header'>
      <div className='ama-activity-avatar'>
        <UserAvatar
          avatar={activity.owner.avatar}
          avatarInitials={activity.owner.avatarInitials} />
      </div>
      <div className='ama-activity-owner-info'>
        <div className='ama-activity-owner-displayName'>{activity.title}</div>

        <div className='ama-activity-timestamp'>
          <TimeAgo date={activity.createdAt} live={false} formatter={(value, unit) =>
              `${value} ${unit.charAt(0)}`} />
        </div>
      </div>
    </div>
    <div className='ama-activity-content'>
      {activity.content}
    </div>
  </div>
)

export default Radium(AMADetails)
