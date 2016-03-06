import React, {PropTypes} from 'react'
import {imageShape, userShape} from '/client/lib/shapes'
import Radium, {StyleRoot} from 'radium'
import {FontIcon} from '/client/lib/ui.jsx'
import {fontSize, spacing} from '/client/configs/theme'
import color from '/client/configs/color'
import moment from 'moment'

class AMADetails extends React.Component {
  render () {
    console.log(this.props)
    return (
      <StyleRoot>
        <div style={s.pageWrapper}>
          <div style={s.main}>
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
  startTime: PropTypes.object.isRequired,
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
    <div style={s.headerMainDiv(props.cover.url)}>
      <HeaderInnerDiv {...props}/>
      <HeaderOverlay {...props}/>
    </div>
  )
}

const HeaderInnerDiv = (props) => {
  return (
    <div style={s.headerInnerDiv}>
      <FontIcon className='material-icons' style={s.hamburgerButton}>menu</FontIcon>
      <div style={s.headerAmaDetailsContainer}>
        <div style={s.headerAmaDateContainer}>
          <span>{moment(props.startTime).format('MMM D').toUpperCase()}</span>
          <span>{moment(props.startTime).format('ha')}</span>
        </div>
        {
          props.isLive
          ? <div style={s.headerAmaLiveNowContainer}>
            <div style={s.headerAmaLiveNowCircle} />
            <span style={s.headerAmaLiveNowLabel}>LIVE NOW</span>
          </div>
          : null
        }
        <span style={s.headerAmaDetailsConversationLabel}>{props.title}</span>
      </div>
    </div>
  )
}

const HeaderOverlay = (props) => {
  return (
    <div style={s.headerOverlayDiv}>
      <div style={s.headerOverlayShareContainer}>
        <span style={s.headerOverlayShareButtonsLabel}>Share</span>
        <div style={s.headerOverlayShareButtonsRow}>
          <i className='fa fa-facebook'/>
        </div>
      </div>
    </div>
  )
}

const RIGHTBAR_WIDTH = 300
const HEADER_HEIGHT = 240

const s = {
  pageWrapper: {
    display: 'flex',
    minHeight: '100vh'
  },
  main: {
    display: 'flex',
    flex: '0 0 100%'
  },
  headerMainDiv: (url) => ({
    display: 'flex',
    flexShrink: 0,
    flexBasis: '100%',
    height: HEADER_HEIGHT,
    backgroundImage: `url(${url})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  }),
  headerInnerDiv: {
    display: 'flex',
    flexGrow: '1',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: spacing.x3
  },
  headerAmaDetailsContainer: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    bottom: spacing.x3,
    left: spacing.x3
  },
  headerAmaDateContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: '0',
    padding: spacing.x1,
    color: 'white',
    borderRadius: 5,
    border: '1px solid white',
    backgroundColor: color.translucentBlack,
    marginRight: spacing.x4
  },
  headerAmaLiveNowContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: spacing.x4
  },
  headerAmaLiveNowCircle: {
    borderRadius: '50%',
    width: 10,
    height: 10,
    backgroundColor: color.dullRed,
    border: `1px solid ${color.dullRed}`,
    marginRight: spacing.x1
  },
  headerAmaLiveNowLabel: {
    color: 'white',
    fontWeight: 300
  },
  headerAmaDetailsConversationLabel: {
    fontSize: fontSize.h4,
    marginBottom: spacing.x1,
    color: 'white'
  },
  headerOverlayDiv: {
    display: 'flex',
    flex: `0 0 ${RIGHTBAR_WIDTH}px`,
    backgroundColor: color.translucentBlack
  },
  headerOverlayShareContainer: {
    padding: spacing.x4
  },
  headerOverlayShareButtonsRow: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  headerOverlayShareButtonsLabel: {
    color: 'white',
    fontSize: fontSize.h6
  },
  hamburgerButton: {
    fontSize: 25,
    color: 'white'
  }
}

export default Radium(AMADetails)
