import React from 'react'
import ListItem from 'material-ui/lib/lists/list-item'
import Avatar from 'material-ui/lib/avatar'

// Helpers

export const NoPaddingListItem = ({children, ...props}) => (
  <ListItem innerDivStyle={{
      paddingLeft: 0,
      paddingTop: 0,
      paddingBottom: 0,
      paddingRight: 0,
    }} {...props} >{children}</ListItem>
)

export const SmallListItem = ({children, ...props}) => (
  <ListItem innerDivStyle={{
      paddingLeft: 24,
      paddingTop: 4,
      paddingBottom: 4,
    }} {...props} >{children}</ListItem>
)

export const MediumListItem = ({children, ...props}) => (
  <ListItem innerDivStyle={{
      paddingTop: 8,
      paddingBottom: 8,
    }} {...props} >{children}</ListItem>
)

export const SquareAvatar = ({children, length, ...props}) => (
  <Avatar style={{
      borderRadius: 5,
      width: length,
      height: length,
    }} {...props}>
    {children}
  </Avatar>
)
