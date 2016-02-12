import React from 'react'
import {Flex} from 'jsxstyle'
import RaisedButton from '../../../../node_modules/material-ui/lib/raised-button'

export default class Menu extends React.Component {
  render () {
    if (this.props.hidden) {
      return null
    }

    return (
      <CoverPhotoMenu {...this.props} />
    )
  }
}

Menu.propTypes = {
  /**
   * True if the menu should be hidden.
   */
  hidden: React.PropTypes.bool,

  /**
   * The title bar of the menu (i.e. breadcrumb info or DM username)
   */
  title: React.PropTypes.string,

  /**
   * True if the Follow/Following action section will be hidden
   */
  hideFollowActionSection: React.PropTypes.bool,

  /**
  * True if this element is already being followed.
  */
  isFollowing: React.PropTypes.bool,

  /**
  * Functions to call when follow action is pressed.
  */
  followFn: React.PropTypes.func,
  unfollowFn: React.PropTypes.func,

  /**
  * True to hide the add new post button
  */
  hidePostButton: React.PropTypes.bool,
  /**
   * Topic
   */
  topic: React.PropTypes.object
}

const pluralizeTextForNumber = (num, text) => {
  if (num === undefined) {
    num = 0
  }
  var str = `${num} ${text}`
  if (num !== 1) {
    str += 's'
  }
  return str
}

const numberOfPostsText = (numPosts) => {
  return pluralizeTextForNumber(numPosts, 'post')
}

const numberOfFollowersText = (numFollowers) => {
  return pluralizeTextForNumber(numFollowers, 'subscriber')
}

const CoverPhotoMenu = (props) => (
  <Flex minHeight={200} height={200} justifyContent='space-between' alignItems='flex-end' padding={25}
    background={`linear-gradient(
      to bottom,
      rgba(0,0,0,0) 40%,
      rgba(0,0,0,0.3) 80%,
      rgba(0,0,0,0.6) 100%),
      url(${props.topic.cover.url})
      no-repeat center`} backgroundSize='100%' style={props.style}>
    <Flex flexDirection='column' color='white'>
      <span style={
        Object.assign(
          {fontWeight: 300, fontSize: 30},
          (props.topic._id === undefined ? {} : {marginBottom: 20}))}>
            #{props.title}
      </span>

      {props.topic._id === undefined
        ? null
        : <Flex flexDirection='row'>
          <span style={{marginRight: 20, fontWeight: 300}}>
            {numberOfPostsText(props.topic.numPosts)}
          </span>
          <span style={{fontWeight: 300}}>
            {numberOfFollowersText(props.topic.followers.length)}
          </span>
        </Flex>
      }
    </Flex>
    {props.topic._id === undefined
      ? null
      : props.isFollowing
        ? <RaisedButton
          label='Subscribed'
          secondary
          onTouchTap={props.unfollowFn} />
        : <RaisedButton
          label='Subscribe'
          primary
          onTouchTap={props.followFn} />
    }
  </Flex>
)
