import React from 'react'
import {Flex} from 'jsxstyle'
import Toolbar from 'material-ui/lib/toolbar/toolbar'
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group'
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator'
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title'
import IconButton from 'material-ui/lib/icon-button'
import FontIcon from 'material-ui/lib/font-icon'
import FlatButton from 'material-ui/lib/flat-button'
import RaisedButton from 'material-ui/lib/raised-button'
import {SquareAvatar} from './helpers.jsx'

// <RaisedButton label='New Post' primary={true} />
const MainHeader = ({showMenuIcon, breadcrumbs, followFn, unfollowFn, isFollowing, showAddPostPopup}) => (
  <Toolbar style={{backgroundColor: 'white', borderBottom: '1px solid #ddd'}}>
    { showMenuIcon
        ? <ToolbarGroup firstChild={true}>
            <IconButton iconClassName='material-icons' tooltip='Menu'>menu</IconButton>
          </ToolbarGroup>
        : null }
    <ToolbarGroup>
      <ToolbarTitle text={breadcrumbs.map(breadcrumb => breadcrumb.name).join(' > ')} />
    </ToolbarGroup>
    <ToolbarGroup style={{height: '100%'}}>
      <Flex alignItems='center' height='100%'>
        <FontIcon className='material-icons'>group</FontIcon>
        <span>11/233</span>
      </Flex>
    </ToolbarGroup>
    <ToolbarGroup>
      { isFollowing
        ? <FlatButton label='Following' style={{ backgroundColor: '#4CAF50', color: '#ffffff' }}
             onTouchTap={unfollowFn} />
        : <FlatButton label='Follow' onTouchTap={followFn} />
      }
    </ToolbarGroup>
    <ToolbarGroup float='right' lastChild={true}>
      <ToolbarSeparator />
      <RaisedButton primary={true} label='New Post' labelPosition='after' onTouchTap={showAddPostPopup}>
          <FontIcon className='material-icons' color='white' style={{
              verticalAlign: 'middle',
              height: '100%',
              marginLeft: 8,
             }}>add_circle</FontIcon>
      </RaisedButton>
    </ToolbarGroup>
  </Toolbar>
)

export default ({
      sidebarOpen,
      showAddPostPopup,
      breadcrumbs,
      followFn,
      unfollowFn,
      isFollowing,
      content = () => null }) => (
    <main style={{
        marginLeft: sidebarOpen ? 240 : 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <MainHeader
        showMenuIcon={!sidebarOpen}
        showAddPostPopup={showAddPostPopup}
        breadcrumbs={breadcrumbs}
        isFollowing={isFollowing}
        followFn={followFn}
        unfollowFn={unfollowFn} />
      {content()}
    </main>
)
