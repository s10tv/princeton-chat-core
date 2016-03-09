import React, {PropTypes} from 'react'
import Radium, {StyleRoot} from 'radium'
import moment from 'moment'
import FontIcon from 'material-ui/lib/font-icon'
import IconButton from 'material-ui/lib/icon-button'
import {imageShape, userShape} from '/client/lib/shapes'
import {UserAvatar} from '/client/lib/helpers.jsx'
import {spacing} from '/client/configs/theme'
import TimeAgo from 'react-timeago'
import Divider from 'material-ui/lib/divider'
import Message from '/client/modules/ama/containers/ama.message'
import AvatarInputBox from '/client/modules/ama/containers/ama.avatarinputbox'
import Linkify from 'react-linkify'
import {AMA_ASK_QUESTION_FORM_NAME} from '/client/configs/constants'
import {Link} from 'react-scroll'

class AMADetails extends React.Component {

  // temporary
  componentWillMount () {
    document.body.style.overflow = 'auto'
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
  splitViewClass () {
    switch (this.props.overideAsideOpen) {
      case null: return 'splitview--initial'
      case true: return 'splitview--aside-open'
      case false: return 'splitview--aside-closed'
    }
    return ''
  }

  render () {
    return (
      <StyleRoot>
        <div className='ama-page-wrapper'>
          <div className='ama-main'>
            <Header {...this.props} />
            <div className={`ama-content ${this.splitViewClass()}`}>
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
  speakerTagLine: PropTypes.string,
  speaker: userShape.isRequired,
  speakerIsTyping: PropTypes.bool,
  participants: PropTypes.arrayOf(userShape).isRequired,
  participantCount: PropTypes.number.isRequired,
  startTime: PropTypes.object.isRequired,
  isSpeaker: PropTypes.bool.isRequired,
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
  overideAsideOpen: PropTypes.bool,
  // actions
  askQuestion: PropTypes.func.isRequired,
  showMenu: PropTypes.func.isRequired,
  twitterShare: PropTypes.func.isRequired,
  fbShare: PropTypes.func.isRequired,
  reply: PropTypes.func.isRequired,
  toggleFeedFilter: PropTypes.func.isRequired,
  toggleAside: PropTypes.func.isRequired
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
        <IconButton className='aside-toggle' onTouchTap={props.toggleAside}
          iconStyle={{color: 'white'}}>
          <FontIcon className='material-icons'>menu</FontIcon>
        </IconButton>
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
          <button type='button' className='btn btn-twitter ama-button-share'
            onClick={(event) => props.twitterShare(event, props.title)}>
            <i className='fa fa-twitter fa-lg'/>
          </button>
          <button type='button' className='btn btn-facebook ama-button-share' onClick={props.fbShare}>
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
  return (
    <div className='ama-activity-main-content main'>
      <div className='top-labels-container'>
        <span className='top-label'>Discussion</span> {/* TODO: add top/recent afterwards */}
      </div>
      <PostMessage currentUser={props.currentUser}
        speaker={props.speaker}
        introText={props.introText}
        amaPostId={props.params.amaPostId}
        speakerTagLine={props.speakerTagLine}
        messageLinkOnClick={props.messageLinkOnClick}
        handleNewMessage={props.askQuestion} />
      <Divider style={{marginTop: spacing.x15, marginBottom: spacing.x15,
          marginLeft: spacing.x3, marginRight: spacing.x3}} />
      {props.messages.map((message) =>
        <div key={message._id}>
          <Message message={message}
            currentUser={props.currentUser}
            amaPostId={props.params.amaPostId}
            speaker={props.speaker}
            isSpeaker={props.isSpeaker}
            messageLinkOnClick={props.messageLinkOnClick}
            speakerTagLine={props.speakerTagLine}
            fbShare={props.fbShare} />
          {message.replies.map((reply) => <Message key={reply._id} message={reply}
            isReply currentUser={props.currentUser}
            fbShare={props.fbShare}
            speaker={props.speaker}
            messageLinkOnClick={props.messageLinkOnClick}
            isSpeaker={props.isSpeaker}
            speakerTagLine={props.speakerTagLine}
            amaPostId={props.params.amaPostId} />)}
        </div>
      )}
    </div>
  )
}

const PostMessage = ({ currentUser, speaker, introText, form, handleNewMessage, speakerTagLine,
 amaPostId, messageLinkOnClick }) => (
  <MessageContainer message={{content: introText, nobottommargin: true}} user={speaker} speakerTagLine={speakerTagLine} isSpeaker
    messageLinkOnClick={messageLinkOnClick}>
    <AvatarInputBox avatar={currentUser.avatar} avatarInitials={currentUser.avatarInitials}
      placeholder={`Ask ${speaker.displayName} a question...`}
      handleNewMessage={handleNewMessage} formType={AMA_ASK_QUESTION_FORM_NAME}
      speaker={speaker}
      amaPostId={amaPostId}/>
  </MessageContainer>
)

export const MessageContainer = ({ message, user, children, isSpeaker, speakerTagLine, isReply,
  messageLinkOnClick }) => (
  <div id={message._id}
    className={`ama-message-container${isReply ? ' ama-message-container-reply' : ''}`}>
    <UserAvatar avatar={user.avatar} avatarInitials={user.avatarInitials} size={40} />
    <div className='message-content-container'>
      <div className='message-content-header'>
        <div>
          <span className={isSpeaker ? 'ama-highlighted-textbox' : 'message-author'}>{user.displayName}</span>
          {isSpeaker ? <span className='message-author-desc'>-{speakerTagLine}</span> : null}
        </div>
        {isSpeaker ? null
          : <span className='message-timestamp'>{moment(message.createdAt).format('h:mm a')}</span>}
      </div>
      <p className={`message-content${message.nobottommargin ? ' message-content-no-bot-margin' : ''}`}>
        <Linkify properties={{onClick: messageLinkOnClick}}>
          {message.content}
        </Linkify>
      </p>
      {children}
    </div>
  </div>
)

const AmaActivities = (props) => (
  <div className='ama-activity-sidebar aside' style={props.style}>
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
  <Link to={activity.amaMessageId} smooth duration={400} style={{cursor: 'pointer'}}>
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
  </Link>
)

export default Radium(AMADetails)
