import React, {PropTypes} from 'react'
import Helmet from 'react-helmet'
import Radium from 'radium'
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
import {AMA_ASK_QUESTION_FORM_NAME} from '../configs/formNames'
import {Link, Events, Element} from 'react-scroll'
import Sticky from 'react-sticky'

class AMADetails extends React.Component {

  // temporary
  componentWillMount () {
    document.body.style.overflow = 'auto'
    Events.scrollEvent.register('end', (to, elem) => {
      this.highlightMessage(elem)
    })
  }

  componentWillUnmount () {
    document.body.style.overflow = 'hidden'
    Events.scrollEvent.remove('end')
  }

  componentDidUpdate () {
    if (this.props.scrollToMsgId && document.getElementById(this.props.scrollToMsgId)) {
      const msgDOM = document.getElementById(this.props.scrollToMsgId)
      msgDOM.scrollIntoView(false)
      this.highlightMessage(msgDOM)
      this.props.clearScrollToMsgId()
    }
  }

  highlightMessage (elem) {
    elem.className = `${elem.className} ama-message-container-animate`

    const removeAnimationClass = () => {
      elem.className = elem.className.replace(' ama-message-container-animate', '')
    }
    // http://stackoverflow.com/questions/6186454/is-there-a-callback-on-completion-of-a-css3-animation
    elem.addEventListener('webkitAnimationEnd', removeAnimationClass)
    elem.addEventListener('animationEnd', removeAnimationClass)
    elem.addEventListener('oanimationEnd', removeAnimationClass)
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
      <div className={`ama-main ${this.splitViewClass()}`}>
        <Helmet title={this.props.title} />
        <Header {...this.props} />
        {!this.props.isMobile && (this.props.overideAsideOpen === true || this.props.overideAsideOpen === null)
          ? <Sticky stickyClass='ama-content-fixed-sidebar' className='ama-content'
            stickyStyle={{}} onStickyStateChange={() => {
              document.getElementById('activities').scrollTop = 0
            }}>
            <AmaMain {...this.props} />
            <AmaActivities {...this.props} />
          </Sticky>
          : <div className='ama-content'>
            <AmaMain {...this.props} />
            <AmaActivities {...this.props} />
          </div>
        }
      </div>
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
  speakerId: PropTypes.string.isRequired,
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
  isMobile: PropTypes.bool.isRequired,
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
    <div className='ama-header' style={{
      backgroundPosition: '50% 40%',
      backgroundImage: `url(${props.cover.url})`
    }}>
      <HeaderInnerDiv {...props}/>
      <HeaderOverlay {...props}/>
    </div>
  )
}

const HeaderInnerDiv = (props) => {
  return (
    <div className='ama-header-inner'>
      <IconButton className='aside-toggle' onTouchTap={props.toggleAside}
        iconStyle={{color: 'white', fontSize: 30}}>
        <FontIcon className='material-icons'>keyboard_arrow_right</FontIcon>
      </IconButton>
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
    <div className='ama-header-overlay overlay'>
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
            <a href='#' key={participant._id} onClick={(e) => {
              e.preventDefault()
              props.showUserProfile(participant)
            }}>
              <UserAvatar
                avatar={participant.avatar}
                avatarInitials={participant.avatarInitials}
                size={30}
                style={{marginRight: spacing.x2}}/>
            </a>
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
        <span className='ama-activity-top-label'>Discussion</span> {/* TODO: add top/recent afterwards */}
      </div>
      <PostMessage handleNewMessage={props.askQuestion} amaPostId={props.params.amaPostId} {...props} />
      <Divider style={{marginTop: spacing.x15, marginBottom: spacing.x15,
          marginLeft: spacing.x3, marginRight: spacing.x3, minHeight: 1}} />
      {props.messages.map((message) =>
        <div className='ama-message-container-wrapper' key={message._id}>
          <Message message={message} amaPostId={props.params.amaPostId} {...props}/>
          {message.replies.map((reply) => <Message key={reply._id} message={reply}
            amaPostId={props.params.amaPostId} isReply {...props} />)}
        </div>
      )}
    </div>
  )
}

const PostMessage = ({ currentUser, speaker, introText, form, handleNewMessage, speakerTagLine,
 amaPostId, messageLinkOnClick, showUserProfile }) => (
  <MessageContainer message={{content: introText, nobottommargin: true}} user={speaker} speakerTagLine={speakerTagLine} isSpeaker
    messageLinkOnClick={messageLinkOnClick} showUserProfile={showUserProfile}>
    <AvatarInputBox avatar={currentUser.avatar} avatarInitials={currentUser.avatarInitials}
      placeholder={currentUser._id === speaker._id ? 'Add a comment...'
        : `Ask ${speaker.displayName} a question...`}
      handleNewMessage={handleNewMessage} formType={AMA_ASK_QUESTION_FORM_NAME}
      speaker={speaker}
      amaPostId={amaPostId} isPostMessage/>
  </MessageContainer>
)

export const MessageContainer = ({ message, user, children, isSpeaker, speakerTagLine, isReply,
  messageLinkOnClick, showUserProfile, isPostMessage }) => (
  <Element id={message._id} name={message._id}
    className={`ama-message-container${isReply ? ' ama-message-container-reply' : ''}`}>
    <a href='#' onClick={(e) => {
      e.preventDefault()
      showUserProfile(user)
    }}>
      <UserAvatar avatar={user.avatar} avatarInitials={user.avatarInitials} size={40} />
    </a>
    <div className='message-content-container'>
      <div className='message-content-header'>
        <div>
          <span className={isSpeaker ? 'ama-highlighted-textbox' : 'message-author'}>{user.displayName}</span>
          {isSpeaker ? <span className='message-author-desc'>-{speakerTagLine}</span> : null}
        </div>
        {isPostMessage ? null
          : <span className='message-timestamp'>{moment(message.createdAt).format('M/D h:mm a')}</span>}
      </div>
      <p className={`message-content${message.nobottommargin ? ' message-content-no-bot-margin' : ''}`}>
        <Linkify properties={{onClick: messageLinkOnClick}}>
          {message.content}
        </Linkify>
      </p>
      {children}
    </div>
  </Element>
)

const AmaActivities = (props) => (
  <div id='activities' className='ama-activity-sidebar aside' style={props.style}>
    <div className='activity-top-label-container'>
      <span className='ama-activity-top-label'>Activity Feed</span>
    </div>
    {!props.speakerIsTyping ? null
      : <SpeakerIsTyping key='speaker-typing' {...props} />}
    {props.activities.map((activity) => (
      <AmaActivity key={activity._id} activity={activity} {...props} />
    ))}
  </div>
)

const SpeakerIsTyping = (props) => {
  return (
    <div className='ama-flex'>
      <div className='ama-activity-speaker' />
      <div className='ama-host-is-typing' style={props.style}>
        <div className='ama-activity-avatar'>
          <UserAvatar
            size={25}
            avatar={props.speaker.avatar}
            avatarInitials={props.speaker.avatarInitials} />
        </div>
        <div className='ama-flex'>
          <span className='ama-highlighted-textbox'>
            {props.speaker.firstName}
          </span>
          <span className='ama-speaker-is-typing'>is typing ... </span>
        </div>
      </div>
    </div>
  )
}

const AmaActivity = ({activity, style, speakerId}) => (
  <Link className='ama-activity-link'
    to={activity.amaMessageId} smooth duration={400} style={{cursor: 'pointer'}}>
    {speakerId === activity.originatorUserId
      ? <div className='ama-activity-speaker' />
      : null
    }
    <div className='ama-activity' style={style}>
      <div className='ama-activity-header'>
        <div className='ama-activity-avatar'>
          <UserAvatar
            size={25}
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
