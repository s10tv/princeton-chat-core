import React from 'react'
import Radium, {Style} from 'radium'
import RaisedButton from '../../../../../node_modules/material-ui/lib/raised-button'
import FontIcon from '../../../../../node_modules/material-ui/lib/font-icon'
import {i18n} from '/client/configs/env'
import {color, fontSize, spacing} from '/client/configs/theme'
import SidebarHeader from './sidebarHeader.jsx'
const theme = i18n('secondaryMuiTheme')

const s = {
  newPost: {
    alignSelf: 'center',
    margin: spacing.x2
  },
  newPostIcon: {
    verticalAlign: 'middle',
    height: '100%',
    marginLeft: 8
  },
  sidebar: {
    transition: '0.5s ease',
    width: 0,
    overflow: 'hidden',
    '@media (min-width: 768px)': {
      width: 240
    }
  },
  sidebarRules: {
    '': {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: color.princeton.black,
      color: color.white
    },
    h3: {
      fontSize: fontSize.sm,
      color: color.gray,
      fontWeight: 'normal',
      paddingLeft: spacing.x2,
      paddingBottom: 4
    },
    ul: {
      padding: 0
    },
    li: {
      listStyle: 'none',
      marginRight: spacing.x3
    },
    a: {
      paddingLeft: spacing.x3,
      display: 'block',
      width: '100%',
      color: color.white,
      borderRadius: '0 3px 3px 0'
    },
    'a:hover': {
      backgroundColor: color.gray,
      opacity: 1
    },
    'ul.medium a': {
      paddingTop: 4,
      paddingBottom: 4
    }
  }
}

class Sidebar extends React.Component {
  getChildContext () {
    return {
      muiTheme: theme
    }
  }
  render () {
    const {user, onLogout, onTapSettings, isFullAdmin} = this.props
    return (
      <nav className='sidebar' style={s.sidebar}>
        <Style scopeSelector='.sidebar' rules={s.sidebarRules} />
        <SidebarHeader
          user={user}
          onLogout={onLogout}
          onTapSettings={onTapSettings} />
        <RaisedButton primary linkButton label='New Post' labelPosition='after' href='/add-post' style={s.newPost}>
          <FontIcon className='material-icons' color='white' style={s.newPostIcon}>
             add_circle
          </FontIcon>
        </RaisedButton>
        <ul className='medium'>
          {!isFullAdmin ? null : <li><a href='/admin/invite'>Admin</a></li>}
          <li><a href='/all-mine'>My Inbox</a></li>
          <li><a href='/all'>All Posts</a></li>
          <li><a href='/choose-topics'>Explore Channels</a></li>
        </ul>
        <h3>CHANNELS</h3>
        <ul style={s.ul}>
          {this.props.followedTopics.map((topic) =>
            <li key={topic._id}>
              <a href={`/topics/${topic._id}`}>{`# ${topic.displayName}`}</a>
            </li>
          )}
        </ul>
      </nav>
    )
  }
}
Sidebar.childContextTypes = {
  muiTheme: React.PropTypes.object
}
Sidebar.propTypes = {
  user: React.PropTypes.object.isRequired,
  onLogout: React.PropTypes.func.isRequired,
  followedTopics: React.PropTypes.array.isRequired,
  currentRouterPath: React.PropTypes.string.isRequired,
  onTapSettings: React.PropTypes.func.isRequired,
  isFullAdmin: React.PropTypes.bool.isRequired
}

export default Radium(Sidebar)
