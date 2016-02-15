/*eslint-disable no-trailing-spaces */
/*eslint-disable comma-dangle */
import React, {PropTypes} from 'react'
import Radium from 'radium'
import {FlatButton, PageControl} from '/client/lib/ui.jsx'
import {color} from '/client/configs/theme'
import style from '../configs/style'
import Layout from './layout'
import TopicList from '/client/modules/core/containers/topic.list'
import AddTopicModal from '/client/modules/core/containers/modal.add.topic.js'
import AddTopicCoverPhotoModal from '/client/modules/core/containers/modal.add.topic.coverphoto.js'
import { Logo } from './ui.jsx'

const SubscribeChannels = (props) => {
  const {channels, onNext, hasSelectedThreeChannels, isLoggedIn} = props
  return (
    <Layout.Window>
      <Layout.Sidebar>
        <header style={style.sidebarHeader}>
          <Logo />
        </header>
        <div style={[style.sidebarInner, s.sidebarInner]}>
          <h1 style={style.h1}>Tell us what you are interested in</h1>
          <img style={s.img} src='/images/ic-handrawn-arrow-right.png' alt='Use the list on the right to subscribe'/>
          <p>You get notified when someone posts in a channel you subscribe.  Subscribe at least 3 channels to get started.</p>
          <p>You can change your preferences later at any time.</p>
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
          <br />
          <PageControl total={3} current={1} />
        </div>
      </Layout.Sidebar>
      <Layout.Main>
        <AddTopicModal shouldRedirectToNewTopic={false} />
        <AddTopicCoverPhotoModal />
        <TopicList isLoggedIn={isLoggedIn} isTopicClickable={false} />
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
const s = {
  sidebarInner: {
    position: 'relative',
  },
  img: {
    position: 'absolute',
    right: 0,
    top: 50,
    width: 69,
    height: 41,
  }
}

export default Radium(SubscribeChannels)
