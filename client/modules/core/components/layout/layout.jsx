import React from 'react'
import {StyleResizable} from 'material-ui/lib/mixins'
import CreatePost from '/client/modules/core/containers/post.create.js'
import SettingsModal from '/client/modules/core/containers/modal.settings.js'
import Sidebar from '/client/modules/core/containers/layout.sidebar.js'
import Profile from '/client/modules/core/containers/modal.profile.js'
import EditProfileModal from '/client/modules/core/containers/modal.editprofile.js'
import AddTopicModal from '/client/modules/core/containers/modal.add.topic.js'
import AddTopicCoverPhotoModal from '/client/modules/core/containers/modal.add.topic.coverphoto.js'
import PostFollowersModal from '/client/modules/core/containers/modal.post.followers.js'
import GlobalSnackbar from '/client/modules/core/containers/global.snackbar.js'
import { i18n } from '/client/configs/env'

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
    content: React.PropTypes.func.isRequired
  },

  render () {
    const isAtLeastDesktop = this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)
    const isAtLastTablet = this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM)

    const sidebarOpen = isAtLastTablet || isAtLeastDesktop
    const content = this.props.content || (() => {})

    return (
      <div id='layout'>
        <Sidebar sidebarOpen={sidebarOpen} />
        {content({ sidebarOpen, isAtLastTablet, isAtLeastDesktop })}
        <CreatePost />
        <SettingsModal />
        <EditProfileModal />
        <PostFollowersModal />
        <AddTopicModal />
        <AddTopicCoverPhotoModal />
        <Profile />
        <GlobalSnackbar />
      </div>
    )
  }
})
