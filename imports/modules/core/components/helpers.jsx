import React from 'react'
import ListItem from 'material-ui/lib/lists/list-item'

// Helpers
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
