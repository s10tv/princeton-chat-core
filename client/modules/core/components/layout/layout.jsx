import React from 'react'
import {StyleResizable} from 'material-ui/lib/mixins'
import CreatePost from '/client/modules/core/containers/post.create.js'
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
    showSidebar: React.PropTypes.func.isRequired
  },

  render () {
    const isAtLeastDesktop = this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)
    const isAtLeastTablet = this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM)
    const isMobile = !isAtLeastTablet
    const sidebarOpen = this.props.clickedToShowSidebar || (isAtLeastTablet || isAtLeastDesktop)
    const rightbarOpen = isAtLeastTablet
    const content = this.props.content || (() => {})

    return (
      <StyleRoot>
        <div id='layout'>
          <Sidebar sidebarOpen={sidebarOpen} clickedToShowSidebar={this.props.clickedToShowSidebar} />
          {content({ sidebarOpen, rightbarOpen, isMobile, showSidebar: this.props.showSidebar })}
          <CreatePost />
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
