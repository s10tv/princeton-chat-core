/*eslint-disable no-trailing-spaces */
/*eslint-disable comma-dangle */
import React, {PropTypes} from 'react'
import Radium, {StyleRoot} from 'radium'
import {FlatButton, PageControl} from 'client/lib/ui.jsx'
import {color} from 'client/configs/theme'
import style from '../configs/style'
import Layout from './layout'
import TopicList from 'client/modules/core/containers/topic.list'
import AddTopicModal from 'client/modules/core/containers/modal.add.topic.js'
import AddTopicCoverPhotoModal from 'client/modules/core/containers/modal.add.topic.coverphoto.js'

const SubscribeChannels = (props) => {
  const {channels, onNext, hasSelectedThreeChannels, isLoggedIn} = props
  return (
    <StyleRoot>
      <Layout.Window>
        <Layout.Sidebar>
          <header style={style.sidebarHeader}>
            <span style={style.sidebarLogo}>Princeton.Chat</span>
          </header>
          <div style={[style.sidebarInner, s.sidebarInner]}>
            <h1 style={style.h1}>Tell us what you are interested in</h1>
            <img style={[s.img, style.notShowOnMobile]} src='/images/ic-handrawn-arrow-right.png' alt='Use the list on the right to subscribe'/>
            <p>You get notified when someone posts in a channel you subscribe.  Subscribe at least 3 channels to get started.</p>
            <p style={{marginBottom: 0}}>You can change your preferences later at any time.</p>
            <h6 style={[style.notShowOnMobile, {marginTop: 20}]}>My Channels</h6>
            <ul style={style.notShowOnMobile}>
              {channels.map((channel) =>
                <li key={channel._id}>#{channel.displayName}</li>
              )}
            </ul>
            <TopicList rootStyle={style.notShowOnDesktop} isLoggedIn={isLoggedIn}
              areTabsShown={false} isTopicClickable={false} />
            <FlatButton
              style={style.button}
              disabled={!hasSelectedThreeChannels}
              label='Next'
              backgroundColor={hasSelectedThreeChannels ? color.green : color.gray}
              hoverColor={color.lightGreen}
              onTouchTap={onNext} />
            <PageControl divStyle={{marginTop: 10, marginBottom: 20}} total={4} current={2} />
          </div>
        </Layout.Sidebar>
        <Layout.Main>
          <AddTopicModal shouldRedirectToNewTopic={false} />
          <AddTopicCoverPhotoModal />
          <TopicList isLoggedIn={isLoggedIn} isTopicClickable={false} />
        </Layout.Main>
      </Layout.Window>
    </StyleRoot>
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
    height: 41
  }
}

export default Radium(SubscribeChannels)
