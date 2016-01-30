import React from 'react';
import {StyleResizable} from 'material-ui/lib/mixins'
import {primaryMuiTheme} from '/imports/modules/core/components/helpers.jsx'
import CreatePost from '/imports/modules/core/containers/post.create.js'
import LogoutModal from '/imports/modules/core/containers/logout.modal.js'
import Sidebar from '/imports/modules/core/containers/layout.sidebar.js';
import Profile from '/imports/modules/core/containers/profile.js'
import EditProfileModal from '/imports/modules/containers/editprofile.modal.js';

// TODO: Figure out a better way that does not involve using Mixin

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
    const sidebarOpen = this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM)
                     || this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)
    const content = this.props.content || () => {};

    return (
      <div id='layout'>
        <Sidebar sidebarOpen={sidebarOpen} />
        {content({ sidebarOpen })}
        <CreatePost />
        <LogoutModal />
        <EditProfileModal />
        <Profile />
      </div>
    )
  }
})
