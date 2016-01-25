import React from 'react'
import {Flex} from 'jsxstyle'
import Toolbar from 'material-ui/lib/toolbar/toolbar'
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group'
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator'
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title'

import IconMenu from 'material-ui/lib/menus/icon-menu'
import IconButton from 'material-ui/lib/icon-button'
import FontIcon from 'material-ui/lib/font-icon'
import NavigationExpandMoreIcon from 'material-ui/lib/svg-icons/navigation/expand-more'
import MenuItem from 'material-ui/lib/menus/menu-item'
import DropDownMenu from 'material-ui/lib/DropDownMenu'
import FlatButton from 'material-ui/lib/flat-button'
import RaisedButton from 'material-ui/lib/raised-button'
import {SquareAvatar} from './helpers.jsx'
import PostList from './post.list.jsx'

// <RaisedButton label="New Post" primary={true} />
const MainHeader = () => (
  <Toolbar style={{backgroundColor: 'white', borderBottom: '1px solid #ddd'}}>
    <ToolbarGroup>
      <ToolbarTitle text="# economics" />
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

export default ({content = () => null }) => (
    <main style={{
        marginLeft: 256,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <MainHeader />
      <PostList />
    </main>
)
