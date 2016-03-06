import React, {PropTypes} from 'react'
import {imageShape, userShape} from '/client/lib/shapes'
import Radium, {StyleRoot} from 'radium'
import {FontIcon} from '/client/lib/ui.jsx'
import moment from 'moment'
import {UserAvatar} from '/client/lib/helpers.jsx'

class AMADetails extends React.Component {
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
  showMenu: PropTypes.func.isRequired,
  twitterShare: PropTypes.func.isRequired,
  askQuestion: PropTypes.func.isRequired,
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
      <FontIcon className='material-icons' style={{fontSize: 25, color: 'white'}}>menu</FontIcon>
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
            <i className='fa fa-twitter'/>
          </button>
          <button type='button' className='btn btn-facebook ama-button-share'>
            <i className='fa fa-facebook'/>
          </button>
        </div>
      </div>
      <div className='overlay-row'>
        <span className='overlay-row-label'>Participants ({props.participants.length})</span>
        <div className='overlay-content-row participants-row'>
          {props.participants.map((participant) =>
            <UserAvatar avatar={participant.avatar} avatarInitials={participant.avatarInitials} size={30}
              style={{marginRight: 6}}/>
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

const AmaMain = (props) => (
  <div className='ama-activity-main-content'>

  </div>
)

const AmaActivities = (props) => (
  <div className='ama-activity-sidebar'>
    {props.activities.map((activity) => (
      <AmaActivity activity={activity} {...props} />
    ))}
  </div>
)

const AmaActivity = ({activity}) => (
  <div key={activity._id}>
    <div>{activity.owner.displayName}</div>
    <div>{activity.content}</div>
  </div>
)

export default Radium(AMADetails)
