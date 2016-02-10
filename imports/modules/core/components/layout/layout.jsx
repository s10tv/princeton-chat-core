import React from 'react';
import {StyleResizable} from 'material-ui/lib/mixins'
import CreatePost from '/imports/modules/core/containers/post.create.js'
import LogoutModal from '/imports/modules/core/containers/logout.modal.js'
import Sidebar from '/imports/modules/core/containers/layout.sidebar.js';
import Profile from '/imports/modules/core/containers/profile.js'
import EditProfileModal from '/imports/modules/core/containers/editprofile.modal.js';
import PostFollowersModal from '/imports/modules/core/containers/post.followers.modal.js'
import GlobalSnackbar from '/imports/modules/core/containers/global.snackbar.js';
import { i18n } from '/imports/libs/mantra'


// TODO: Figure out a better way that does not involve using Mixin

const primaryMuiTheme = i18n('primaryMuiTheme')

export default React.createClass({
  mixins: [
    StyleResizable
  ],
  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },
  getChildContext() {
    return {
      muiTheme: primaryMuiTheme,
    }
  },
  render() {
    const isAtLeastDesktop = this.isDeviceSize(StyleResizable.statics.Sizes.LARGE);
    const isAtLastTablet = this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM);
    const isAtLeastMobile = this.isDeviceSize(StyleResizable.statics.Sizes.SMALL);

    const sidebarOpen = isAtLastTablet || isAtLeastDesktop;
    const content = this.props.content || () => {};

    return (
      <div id='layout'>
        <Sidebar sidebarOpen={sidebarOpen} />
        {content({ sidebarOpen, isAtLastTablet, isAtLeastDesktop })}
        <CreatePost />
        <LogoutModal />
        <EditProfileModal />
        <PostFollowersModal />
        <Profile />
        <GlobalSnackbar />
      </div>
    )
  }
})
