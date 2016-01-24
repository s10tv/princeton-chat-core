import React from 'react'
import {Flex} from 'jsxstyle'
import LeftNav from 'material-ui/lib/left-nav'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import Avatar from 'material-ui/lib/avatar'
import Divider from 'material-ui/lib/divider'
import {SmallListItem, MediumListItem} from './helpers.jsx'

import FontIcon from 'material-ui/lib/font-icon'

const SidebarHeader = () => (
  <ListItem id='sidebar-header' innerDivStyle={{
      paddingTop: 8,
      paddingRight: 8,
      paddingBottom: 8,
      paddingLeft: 8,
    }}>
    <Flex>
      <Avatar src='http://lorempixel.com/200/200/people/' style={{
          borderRadius: 5,
          width: 60,
          height: 60,
        }} />
      <Flex flexGrow={1} marginLeft={8} flexDirection='column' justifyContent='space-around'>
        <h3>Princeton.Chat</h3>
        <Flex alignItems='center'>
          <span className='online-status' />
          <span>@tonyx</span>
          <FontIcon className='material-icons' style={{marginLeft: 'auto'}}>expand_more</FontIcon>
        </Flex>
      </Flex>
    </Flex>
  </ListItem>
)

export default ({content = () => null }) => (
  <LeftNav open={true} >
    <SidebarHeader />  
    <Divider />
    <List>
      <MediumListItem>Posts for me</MediumListItem>
      <MediumListItem>All Posts</MediumListItem>
      <MediumListItem>Housing</MediumListItem>
      <MediumListItem>Jobs</MediumListItem>
    </List>
    <List subheader='TOPICS'>
      {['economics', 'software', 'politics'].map((topic) =>
          <SmallListItem key={topic}># {topic}</SmallListItem>
      )}
    </List>
    <List subheader='DIRECT MESSAGES'>
      {['tigercub', 'fang', 'nurym'].map((username) =>
          <SmallListItem key={username}>@ {username}</SmallListItem>
      )}
    </List>
  </LeftNav>
)
