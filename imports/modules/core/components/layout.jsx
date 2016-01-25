import React from 'react';
import Sidebar from './layout.sidebar.jsx'
import Main from './layout.main.jsx'
import CreatePost from './post.create.jsx'
import {StyleResizable} from 'material-ui/lib/mixins'

// TODO: Figure out a better way that does not involve using Mixin

export default React.createClass({
  mixins: [
    StyleResizable
  ],
  
  render() {
    const sidebarOpen = this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM)
                     || this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)
    return (
      <div id='layout'>
        <Sidebar sidebarOpen={sidebarOpen} />
        <Main sidebarOpen={sidebarOpen} content={this.props.content} />
        <CreatePost open={false} />
      </div>
    )
  }
})
