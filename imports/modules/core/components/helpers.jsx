import React from 'react'
import ListItem from 'material-ui/lib/lists/list-item'
import Avatar from 'material-ui/lib/avatar'
import darkRawTheme from 'material-ui/lib/styles/raw-themes/dark-raw-theme'
import lightRawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme'
import ThemeManager from 'material-ui/lib/styles/theme-manager'
import Colors from 'material-ui/lib/styles/colors'
import Spacing from 'material-ui/lib/styles/spacing'
import ColorManipulator from 'material-ui/lib/utils/color-manipulator'

export const systemFont = `-apple-system, BlinkMacSystemFont, 
  "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", 
  "Fira Sans", "Droid Sans", "Avenir Next", "Helvetica Neue", 
  sans-serif`

export const articleFont = 'medium-content-serif-font, Georgia, Cambria, "Times New Roman", Times, serif'

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

export const primaryMuiTheme = ThemeManager.getMuiTheme({
  spacing: Spacing,
  fontFamily: systemFont,
  palette: {
    ...lightRawTheme.palette,
    accent1Color: '#F07621', // Princeton Orange
  },
})

export const secondaryMuiTheme = ThemeManager.getMuiTheme({
  spacing: Spacing,
  fontFamily: systemFont,
  palette: {
    ...darkRawTheme.palette,
  },
})
