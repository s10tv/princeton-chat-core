import React from 'react'
import {Flex} from 'jsxstyle'
import Toolbar from 'material-ui/lib/toolbar/toolbar'
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group'
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title'
import IconButton from 'material-ui/lib/icon-button'
import FontIcon from 'material-ui/lib/font-icon'
import FlatButton from 'material-ui/lib/flat-button'
import truncate from 'truncate'
import RaisedButton from 'material-ui/lib/raised-button'

export default class Menu extends React.Component {
  render () {
    if (this.props.hidden) {
      return null
    }

    return (
      this.props.isPostListScreen
        ? <CoverPhotoMenu {...this.props} />
        : <ToolbarMenu {...this.props} />
    )
  }
}

Menu.propTypes = {
  /**
   * True if the menu should be mobile optimized.
   */
  isMobile: React.PropTypes.bool,

  /**
   * True if the menu should be hidden.
   */
  hidden: React.PropTypes.bool,

  /**
   * The title bar of the menu (i.e. breadcrumb info or DM username)
   */
  title: React.PropTypes.string,

  /**
   * True if the title section should be hidden
   */
  hideTitleSection: React.PropTypes.bool,

  /**
   * This text will be prepended with a person avatar.
   */
  followersCount: React.PropTypes.number,

  /**
   * True if the followers section should be hidden
   */
  hideFollowerSection: React.PropTypes.bool,

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
   * For media queries
   */
  isAtLastTablet: React.PropTypes.bool,
  isAtLastDesktop: React.PropTypes.bool,
  sidebarOpen: React.PropTypes.bool,
  /**
   * Function to show topic followers modal from a ready list of followers
   */
  showTopicFollowersFromFollowersListFn: React.PropTypes.func,

  /**
   * True means the title is no longer clickable
   */
  disableClickToShowFollowers: React.PropTypes.bool,

  /**
   * Topic
   */
  topic: React.PropTypes.object,

  /**
   * If true, shows an extended menu with a cover photo
   */
  isPostListScreen: React.PropTypes.bool
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
  return pluralizeTextForNumber(numFollowers, 'follower')
}

const CoverPhotoMenu = (props) => (
  <Flex minHeight={200} height={200} justifyContent='space-between' alignItems='flex-end' padding={25}
    background='linear-gradient(
      to bottom,
      rgba(0,0,0,0) 40%,
      rgba(0,0,0,0.3) 80%,
      rgba(0,0,0,0.6) 100%),
      url("https://images.unsplash.com/photo-1438962136829-452260720431")
      no-repeat fixed center' backgroundSize='100%'>
    <Flex flexDirection='column' color='white'>
      <span style={{fontWeight: 300, marginBottom: 20, fontSize: 30}}>#{props.title}</span>
      <Flex flexDirection='row'>
        <span style={{marginRight: 20, fontWeight: 300}}>
          {numberOfPostsText(props.topic.numPosts)}
        </span>
        <span style={{fontWeight: 300}}>
          {numberOfFollowersText(props.topic.followers.length)}
        </span>
      </Flex>
    </Flex>
    {props.isFollowing
      ? <RaisedButton
        label='Following'
        secondary
        onTouchTap={props.unfollowFn} />
      : <RaisedButton
        label='Follow'
        primary
        onTouchTap={props.followFn} />
    }
  </Flex>
)

const ToolbarMenu = (props) => {
  const getTitleText = () => {
    if (props.isAtLastTablet) {
      return truncate(props.title, 50)
    } else if (props.isAtLastTablet) {
      return truncate(props.title, 30)
    } else {
      return '' // mobile devices are too small to display titles.
    }
  }

  const getFollowerButton = () => {
    const emailIcon = props.sidebarOpen ? null
    : <FontIcon className='material-icons' color='white'
      style={{
        verticalAlign: 'middle',
        height: '100%',
        marginLeft: (props.sidebarOpen ? 8 : 0)
      }}>
      email
    </FontIcon>

    if (props.isFollowing) {
      return <FlatButton
        label={props.sidebarOpen ? 'Following' : null}
        style={{
          backgroundColor: '#8BC34A',
          color: '#ffffff'
        }}
        onTouchTap={props.unfollowFn}>
          {emailIcon}
      </FlatButton>
    } else {
      return <FlatButton
        label={props.sidebarOpen ? 'Follow' : null}
        style={{
          backgroundColor: '#F06721',
          color: '#ffffff'
        }}
        onTouchTap={props.followFn}>
          {emailIcon}
      </FlatButton>
    }
  }

  const getOptionallyClickableTitleText = (children) => {
    if (props.disableClickToShowFollowers) {
      return <span>{children}</span>
    }

    return (
      <a className='topic-header-link-button'
        href='#'
        onClick={() =>
          props.showTopicFollowersFromFollowersListFn(props.topic.followersList)}>
        {children}
      </a>
    )
  }

  return (
    <Toolbar style={{backgroundColor: 'white', borderBottom: '1px solid #ddd', zIndex: 1000}}>

      {props.sidebarOpen ? null
        : <ToolbarGroup firstChild>
          <IconButton iconClassName='material-icons' tooltip='Menu'
            onTouchTap={() => {
              console.log('clicked menu')
            }}>
            menu
          </IconButton>
        </ToolbarGroup>
      }

      {props.hideTitleSection ? null
        : <ToolbarGroup >
          {getOptionallyClickableTitleText(<ToolbarTitle text={getTitleText()} />)}
        </ToolbarGroup>
      }

      {props.hideFollowerSection ? null
        : <ToolbarGroup style={{height: '100%'}}>
          <Flex alignItems='center' height='100%'>
            <a className='topic-header-link-button' href='#'
              onClick={() =>
                props.showTopicFollowersFromFollowersListFn(props.topic.followersList)}
              style={{display: 'flex', alignItems: 'center'}}>
              <FontIcon className='material-icons' tooltip='Followers'>group</FontIcon>
              <span style={{marginLeft: 5}}>{props.followersCount}</span>
            </a>
          </Flex>
        </ToolbarGroup>
      }

      {props.hideFollowActionSection ? null
        : <ToolbarGroup
          float='right'
          lastChild>
          {getFollowerButton()}
        </ToolbarGroup>
      }

    </Toolbar>
  )
}
