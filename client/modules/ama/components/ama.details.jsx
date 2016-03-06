import React, {PropTypes} from 'react'
import {imageShape, userShape} from '/client/lib/shapes'
import Radium, {StyleRoot} from 'radium'
import {FontIcon} from '/client/lib/ui.jsx'
import moment from 'moment'

class AMADetails extends React.Component {
  render () {
    console.log(this.props)
    return (
      <StyleRoot>
        <div className='ama-page-wrapper'>
          <div className='ama-main'>
            <Header {...this.props}/>
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
  activities: PropTypes.arrayOf(PropTypes.shape({
    isMine: PropTypes.bool.isRequired,
    owner: userShape.isRequired,
    message: PropTypes.shape({
      _id: PropTypes.string.isRequired
    }),
    createdAt: PropTypes.object.isRequired
  }))
}

const Header = (props) => {
  return (
    <div className='ama-header' style={{backgroundImage: `url(${data.coverUrl})`}}>
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
        {
          props.isLive
          ? <div className='header-live-now-container'>
            <div className='header-live-now-circle'/>
            <span className='header-live-now-label'>LIVE NOW</span>
          </div>
          : null
        }
        <span className='header-conversation-label'>{data.conversationLabel}</span>
      </div>
    </div>
  )
}

const HeaderOverlay = (props) => {
  return (
    <div className='ama-header-overlay'>
      <div className='share-container'>
        <span className='share-buttons-label'>Share</span>
        <div >
          <i className='fa fa-facebook'/>
        </div>
      </div>
    </div>
  )
}

const data = {
  coverUrl: 'https://images.unsplash.com/photo-1454678904372-2ca94103eca4?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=dcc8a4008017a59eb862846cd4fdc34b',
  conversationLabel: 'Conversation with Steve Schlafman \'99'
}

export default Radium(AMADetails)
