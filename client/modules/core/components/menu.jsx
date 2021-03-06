import React from 'react'
import {Flex} from 'jsxstyle'
import { RaisedButton } from '/client/lib/ui.jsx'
import Radium from 'radium'
import SearchBox from '/client/modules/core/containers/search'

class Menu extends React.Component {
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
   * Topic
   */
  topic: React.PropTypes.object,

  /**
   * Initial search box value
   */
  currentSearchValue: React.PropTypes.string,

  /**
   * Inital search icon, if true - people, false - content
   */
  initialIsSearchingPeople: React.PropTypes.bool,

  shouldShowSearch: React.PropTypes.bool
}

Menu.defaultProps = {
  shouldShowSearch: true
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

var CoverPhotoMenu = (props) => (
  <div style={[props.style, styles.coverPhoto(props.topic.cover.url)]} >
    <Flex justifyContent='flex-end'>

      {props.shouldShowSearch
      ? <Flex>
        <h1>
          <SearchBox initialSearchPeopleIcon={props.initialIsSearchingPeople}
            currentSearchValue={props.currentSearchValue} />
        </h1>
      </Flex>
      : <Flex />}
    </Flex>

    <Flex flexGrow={1} justifyContent='space-between' alignItems='flex-end'>
      <Flex flexDirection='column' color='white'>
        <span style={
          Object.assign(
            {fontWeight: 300, fontSize: 30},
            (props.topic._id === undefined ? {} : {marginBottom: 20}))}>
              {props.topic._id ? `#${props.topic.displayName}` : props.topic.displayName}
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
  </div>
)

CoverPhotoMenu = Radium(CoverPhotoMenu)

const styles = {
  coverPhoto: (url) => ({
    display: 'flex',
    maxHeight: 200,
    minHeight: 200,
    padding: 25,
    flexGrow: 1,
    flexDirection: 'column',
    backgroundImage: `linear-gradient(
      to bottom,
      rgba(0,0,0,0.2) 30%,
      rgba(0,0,0,0.4) 60%,
      rgba(0,0,0,0.6) 100%),
      url(${url})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100%',
    '@media (max-width: 768px)': {
      backgroundSize: 'cover'
    }
  })
}

export default Radium(Menu)
