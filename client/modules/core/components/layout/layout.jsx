import React from 'react'
import Transitions from 'material-ui/lib/styles/transitions'
import FontIcon from 'material-ui/lib/font-icon'
import IconButton from 'material-ui/lib/icon-button'
import Sidebar from '/client/modules/core/containers/layout.sidebar.js'
import Profile from '/client/modules/core/containers/modal.profile.js'
import AddTopicModal from '/client/modules/core/containers/modal.add.topic.js'
import AddTopicCoverPhotoModal from '/client/modules/core/containers/modal.add.topic.coverphoto.js'
import PostFollowersModal from '/client/modules/core/containers/modal.post.followers.js'
import GlobalSnackbar from '/client/modules/core/containers/global.snackbar.js'
import {StyleRoot} from 'radium'
import LeftNav from 'material-ui/lib/left-nav'
import {MuiTheme} from '/client/lib/ui.jsx'
import color from '/client/configs/color'

const s = {
  main: {
    transition: Transitions.easeOut(null, ['transform', 'margin-left'], null)
  }
}
const Layout = ({sidebarOpen, sidebarDocked, onRequestChange, toggleSidebar, children}) => (
  <MuiTheme theme='primary'>
    <StyleRoot>
      <MuiTheme theme='secondary'>
        <LeftNav width={240} containerClassName='sidebar' docked={sidebarDocked}
          open={sidebarOpen} onRequestChange={onRequestChange}>
          <Sidebar />
        </LeftNav>
      </MuiTheme>
      <main className={sidebarOpen ? 'content--extended' : 'content'} style={s.main}>
        <nav className='topbar'>
          <IconButton className='sidebar-toggle' onTouchTap={toggleSidebar}
            iconStyle={{color: color.lightGray}}>
            <FontIcon className='material-icons'>menu</FontIcon>
          </IconButton>
        </nav>
        {children}
      </main>
      <PostFollowersModal />
      <AddTopicModal />
      <AddTopicCoverPhotoModal />
      <Profile />
      <GlobalSnackbar />
    </StyleRoot>
  </MuiTheme>
)
Layout.propTypes = {
  sidebarOpen: React.PropTypes.bool.isRequired,
  sidebarDocked: React.PropTypes.bool.isRequired,
  toggleSidebar: React.PropTypes.func.isRequired,
  onRequestChange: React.PropTypes.func.isRequired
}
export default Layout
