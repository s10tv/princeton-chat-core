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

export default ({content = () => null }) => (
  <LeftNav open={true} >
    <CardHeader
      title="Princeton.Chat"
      subtitle="@tonyx"
      avatar={
        <Avatar src='http://lorempixel.com/200/200/people/' style={{
            borderRadius: 5
          }} />
      } />
    
    
    <List>
      <ListItem>First Item</ListItem>
      <ListItem>Second Item</ListItem>
    </List>
  </LeftNav>
)
// <header>
//   
// </header>
