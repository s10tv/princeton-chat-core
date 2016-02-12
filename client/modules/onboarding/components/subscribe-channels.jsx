/*eslint-disable no-trailing-spaces */
/*eslint-disable comma-dangle */
import React, {PropTypes} from 'react'
import Radium from 'radium'
import {TextField, SelectField, MenuItem, FlatButton, OrDivider} from '/client/lib/ui.jsx'
import {color, spacing, fontSize} from '/client/config/theme'
import style from './style'
import Layout from './layout'
import TopicList from '/client/modules/core/containers/topic.list'

const SubscribeChannels = (props) => {
  const {channels} = props
  return (
    <Layout.Window>
      <Layout.Sidebar>
        <header style={style.sidebarHeader}>
          <span style={style.sidebarLogo}>Princeton.Chat</span>
        </header>
        <div style={style.sidebarInner}>
          <h1 style={style.h1}>Tell us what you are interested in</h1>
          <p>You get notified when someone posts in a channel you subscribe.  Subscribe at least 3 channels to get started.</p>
          <h6>My Channels</h6>
          <ul>
            {channels.map((channel) => 
              <li key={channel._id}>#{channel.displayName}</li>
            )}
          </ul>
          <FlatButton style={style.button} label='Next'
                      backgroundColor={color.green} hoverColor={color.lightGreen} />
        </div>
      </Layout.Sidebar>
      <Layout.Main>
        <TopicList />
      </Layout.Main>
    </Layout.Window>
  )
}
// TODO: Specify the shape of a field
SubscribeChannels.propTypes = {
  channels: PropTypes.array.isRequired,
}
// const s = {
// }

export default Radium(SubscribeChannels)
