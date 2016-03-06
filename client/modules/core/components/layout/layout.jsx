import React from 'react'
import {StyleResizable} from 'material-ui/lib/mixins'
import Transitions from 'material-ui/lib/styles/transitions'
import FontIcon from 'material-ui/lib/font-icon'
import IconButton from 'material-ui/lib/icon-button'
import Sidebar from '/client/modules/core/containers/layout.sidebar.js'
import Profile from '/client/modules/core/containers/modal.profile.js'
import AddTopicModal from '/client/modules/core/containers/modal.add.topic.js'
import AddTopicCoverPhotoModal from '/client/modules/core/containers/modal.add.topic.coverphoto.js'
import PostFollowersModal from '/client/modules/core/containers/modal.post.followers.js'
import GlobalSnackbar from '/client/modules/core/containers/global.snackbar.js'
import { i18n } from '/client/configs/env'
import {StyleRoot} from 'radium'
import LeftNav from 'material-ui/lib/left-nav'
import {MuiTheme} from '/client/lib/ui.jsx'

// TODO: Figure out a better way that does not involve using Mixin

const primaryMuiTheme = i18n('primaryMuiTheme')

export default React.createClass({
  mixins: [
    StyleResizable
  ],

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext () {
    return {
      muiTheme: primaryMuiTheme
    }
  },

  propTypes: {
    content: React.PropTypes.func.isRequired,
    showSidebar: React.PropTypes.bool,
    toggleSidebar: React.PropTypes.func.isRequired,
    updateSidebar: React.PropTypes.func.isRequired
  },

  render () {
    const {showSidebar, updateSidebar} = this.props
    const isAtLeastTablet = this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM)
    const isMobile = !isAtLeastTablet
    const rightbarOpen = isAtLeastTablet
    const content = this.props.content || (() => {})
    const s = {
      main: {
        transition: Transitions.easeOut(null, ['transform', 'margin-left'], null)
      }
    }
    return (
      <MuiTheme theme='primary'>
        <StyleRoot>
          <MuiTheme theme='secondary'>
            <LeftNav width={240} containerClassName='sidebar' docked={isAtLeastTablet}
              open={showSidebar} onRequestChange={updateSidebar}>
              <Sidebar />
            </LeftNav>
          </MuiTheme>
          <main className={showSidebar ? 'content--extended' : 'content'} style={s.main}>
            <nav className='topbar'>
              <IconButton className='sidebar-toggle' onTouchTap={this.props.toggleSidebar}>
                <FontIcon className='material-icons'>menu</FontIcon>
              </IconButton>
            </nav>
            {content({ rightbarOpen, isMobile })}
          </main>
          <PostFollowersModal />
          <AddTopicModal />
          <AddTopicCoverPhotoModal />
          <Profile />
          <GlobalSnackbar />
        </StyleRoot>
      </MuiTheme>
    )
  }
})
