import React from 'react'
import LeftNav from 'material-ui/lib/left-nav'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import Card from 'material-ui/lib/card/card'
import CardActions from 'material-ui/lib/card/card-actions'
import CardHeader from 'material-ui/lib/card/card-header'
import CardMedia from 'material-ui/lib/card/card-media'
import CardTitle from 'material-ui/lib/card/card-title'
import Avatar from 'material-ui/lib/avatar'
import FlatButton from 'material-ui/lib/flat-button'
import EnhancedButton from 'material-ui/lib/enhanced-button'
import Divider from 'material-ui/lib/divider'
import {Block, Flex} from 'jsxstyle'

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
      <ListItem>First Item</ListItem>
      <ListItem>Second Item</ListItem>
    </List>
  </LeftNav>
)
// <header>
//   
// </header>
// <div>
//   <EnhancedButton linkButton={true}>
//     <Avatar src='http://lorempixel.com/200/200/people/' style={{
//         borderRadius: 5
//       }} />
//     Princeton.Chat
//     @tonyx
//   </EnhancedButton>
// </div>
// <FlatButton style={{width: '100%'}}>
//   <Avatar src='http://lorempixel.com/200/200/people/' style={{
//       borderRadius: 5
//     }} />
//   Princeton.Chat
//   @tonyx
// </FlatButton>
// <Divider />

// <CardHeader
//   title="Princeton.Chat"
//   subtitle="@tonyx"
//   avatar={
//     <Avatar src='http://lorempixel.com/200/200/people/' style={{
//         borderRadius: 5
//       }} />
//   } />
