import React from 'react'
import {Flex} from 'jsxstyle'
import Toolbar from 'material-ui/lib/toolbar/toolbar'
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group'
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator'
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title'
import IconButton from 'material-ui/lib/icon-button'
import FontIcon from 'material-ui/lib/font-icon'
import RaisedButton from 'material-ui/lib/raised-button'
import {SquareAvatar} from './helpers.jsx'
import PostList from './post.list.jsx'

// <RaisedButton label='New Post' primary={true} />
const MainHeader = ({showMenuIcon}) => (
  <Toolbar style={{backgroundColor: 'white', borderBottom: '1px solid #ddd'}}>
    { showMenuIcon 
        ? <ToolbarGroup firstChild={true}>
            <IconButton iconClassName='material-icons' tooltip='Menu'>menu</IconButton>
          </ToolbarGroup>
        : null }
    <ToolbarGroup>
      <ToolbarTitle text='# economics' />
    </ToolbarGroup>
    <ToolbarGroup float='right' lastChild={true}>
      <RaisedButton primary={true} label='New Post' labelPosition='after'>
          <FontIcon className='material-icons' color='white' style={{
              verticalAlign: 'middle',
              height: '100%',
              marginLeft: 8,
             }}>add_circle</FontIcon>
      </RaisedButton>
    </ToolbarGroup>
  </Toolbar>
)

export default ({sidebarOpen, content = () => null }) => (
    <main style={{
        marginLeft: sidebarOpen ? 256 : 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <MainHeader showMenuIcon={!sidebarOpen} />
      <PostList />
    </main>
)
