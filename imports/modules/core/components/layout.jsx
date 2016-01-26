import React from 'react';
import {StyleResizable} from 'material-ui/lib/mixins'
import {primaryMuiTheme} from './helpers.jsx'
import CreatePost from '../containers/post.create.js'
import Main from '../containers/layout.main.js'
import Sidebar from '../containers/layout.sidebar.js';

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
    return (
      <div id='layout'>
        <Sidebar sidebarOpen={sidebarOpen} />
        <Main
            sidebarOpen={sidebarOpen}
            content={this.props.content} />
          <CreatePost />
      </div>
    )
  }
})
