/*eslint-disable no-trailing-spaces */
/*eslint-disable comma-dangle */
import React, {PropTypes} from 'react'
import Radium from 'radium'
import {FlatButton, PageControl} from '/client/lib/ui.jsx'
import {color} from '/client/configs/theme'
import style from '../configs/style'
import Layout from './layout'
import TopicList from '/client/modules/core/containers/topic.list'

const SubscribeChannels = (props) => {
  const {channels, onNext, hasSelectedThreeChannels, isLoggedIn} = props
  return (
    <Layout.Window>
      <Layout.Sidebar>
        <header style={style.sidebarHeader}>
          <span style={style.sidebarLogo}>Princeton.Chat</span>
        </header>
        <div style={style.sidebarInner}>
          <h1 style={style.h1}>Tell us what you are interested in</h1>
          <p>You get notified when someone posts in a channel you subscribe.  Subscribe at least 3 channels to get started.</p>
          <p>You can change your preferences later at any time</p>
          <br />
          <h6>My Channels</h6>
          <ul>
            {channels.map((channel) =>
              <li key={channel._id}>#{channel.displayName}</li>
            )}
          </ul>
          <FlatButton
            style={style.button}
            disabled={!hasSelectedThreeChannels}
            label='Next'
            backgroundColor={hasSelectedThreeChannels ? color.green : color.gray}
            hoverColor={color.lightGreen}
            onTouchTap={onNext} />
          <PageControl total={3} current={1} />
        </div>
      </Layout.Sidebar>
      <Layout.Main>
        <TopicList isLoggedIn={isLoggedIn} />
      </Layout.Main>
    </Layout.Window>
  )
}
// TODO: Specify the shape of a field
SubscribeChannels.propTypes = {
  channels: PropTypes.array.isRequired,
  hasSelectedThreeChannels: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
// const s = {
// }

export default Radium(SubscribeChannels)
