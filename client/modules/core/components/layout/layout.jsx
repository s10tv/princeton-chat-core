import React from 'react'
import {StyleResizable} from 'material-ui/lib/mixins'
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
    clickedToShowSidebar: React.PropTypes.bool,
    toggleSidebar: React.PropTypes.func.isRequired
  },

  render () {
    const isAtLeastTablet = this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM)
    const isMobile = !isAtLeastTablet
    const sidebarOpen = this.props.clickedToShowSidebar
    const rightbarOpen = isAtLeastTablet
    const content = this.props.content || (() => {})
    console.log('Sidebar Open ', sidebarOpen)
    return (
      <StyleRoot>
        <div className='window'>
          <nav className='sidebar'>
            <Sidebar sidebarOpen={sidebarOpen} clickedToShowSidebar={this.props.clickedToShowSidebar} />
          </nav>
          <main className={sidebarOpen ? 'content--extended' : 'content'}>
            <nav className='topbar'>
              <IconButton className='sidebar-toggle' onTouchTap={this.props.toggleSidebar}>
                <FontIcon className='material-icons'>menu</FontIcon>
              </IconButton>
            </nav>
            {content({ sidebarOpen, rightbarOpen, isMobile })}
          </main>
          <PostFollowersModal />
          <AddTopicModal />
          <AddTopicCoverPhotoModal />
          <Profile />
          <GlobalSnackbar />
        </div>
      </StyleRoot>
    )
  }
})
