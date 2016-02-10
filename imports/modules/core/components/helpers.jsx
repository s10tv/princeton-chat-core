import React from 'react'
import {Flex} from 'jsxstyle'
import ListItem from 'material-ui/lib/lists/list-item'
import Avatar from 'material-ui/lib/avatar'
import darkRawTheme from 'material-ui/lib/styles/raw-themes/dark-raw-theme'
import lightRawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme'
import ThemeManager from 'material-ui/lib/styles/theme-manager'
import Colors from 'material-ui/lib/styles/colors'
import Spacing from 'material-ui/lib/styles/spacing'
import CircularProgress from 'material-ui/lib/circular-progress'
import ReactDOM from 'react-dom'

// export const systemFont = `-apple-system, BlinkMacSystemFont,
//   "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell",
//   "Fira Sans", "Droid Sans", "Avenir Next", "Helvetica Neue",
//   sans-serif`
export const systemFont = 'Lato, sans-serif'

export const articleFont = 'medium-content-serif-font, Georgia, Cambria, "Times New Roman", Times, serif'

// Helpers

export const Loading = () => (
  <Flex flex={1} justifyContent='center' alignItems='center' flexDirection='column' marginLeft={240} height='100vh'>
    <span style={{color: 'gray'}}>Loading...</span>
    <CircularProgress />
  </Flex>
)

export const NoPaddingListItem = (props) => (
  <ListItem innerDivStyle={{
    paddingLeft: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 0
  }} {...props} >{props.children}</ListItem>
)

export const SmallListItem = (props) => (
  <ListItem innerDivStyle={{
    paddingLeft: 24,
    paddingTop: 4,
    paddingBottom: 4
  }} {...props} >{props.children}</ListItem>
)

export const MediumListItem = (props) => (
  <ListItem innerDivStyle={{
    paddingTop: 8,
    paddingBottom: 8
  }} {...props} >{props.children}</ListItem>
)

export const SquareAvatar = (props) => (
  <CoverAvatar {...props} size={props.length} style={Object.assign({
    borderRadius: 5,
    fontWeight: 300
  }, props.style)}>
    {props.children}
  </CoverAvatar>
)

export const LetterAvatar = (props) => (
  <Avatar {...props} style={Object.assign({}, {fontWeight: 300}, props.style)}>
    {props.children}
  </Avatar>
)

export const CoverAvatar = (props) => (
  <Avatar {...props} style={Object.assign({objectFit: 'cover'}, props.style)}>
    {props.children}
  </Avatar>
)

export const primaryMuiTheme = ThemeManager.getMuiTheme({
  spacing: Spacing,
  fontFamily: systemFont,
  palette: {
    ...lightRawTheme.palette,
    accent1Color: '#F07621' // princeton orange
  }
})

export const secondaryMuiTheme = ThemeManager.getMuiTheme({
  spacing: Spacing,
  fontFamily: systemFont,
  palette: {
    ...darkRawTheme.palette,
    accent1Color: '#F07621', // princeton orange
    alternateTextColor: Colors.white
  }
})

export const pedPrimaryMuiTheme = ThemeManager.getMuiTheme({
  spacing: Spacing,
  fontFamily: systemFont,
  palette: {
    ...lightRawTheme.palette,
    accent1Color: '#5477AD' // ped blue
  }
})

export const pedSecondaryMuiTheme = ThemeManager.getMuiTheme({
  spacing: Spacing,
  fontFamily: systemFont,
  palette: {
    ...darkRawTheme.palette,
    accent1Color: '#5477AD', // ped blue
    primary3Color: '#4E6A93', // not-so-dark blue
    alternateTextColor: Colors.white,
    canvasColor: '#1B293D' // dark blue
  }
})

export class ScrollingContainer extends React.Component {
  scrollToBottom () {
    const node = ReactDOM.findDOMNode(this)
    node.scrollTop = node.scrollHeight
  }
  componentDidMount () {
    this.scrollToBottom()
  }
  componentWillUpdate () {
    const node = ReactDOM.findDOMNode(this)

    if (this.props.alwaysScrollToBottom) {
      // sometimes (in case with onboarding) it is important to always scroll to the bottom
      // whenever a component is about to update.
      this.shouldScrollBottom = true
    } else {
      // Sometimes scrollTop + offsetHeight is greater than scrollHeight.. Maybe border? >= for workaround
      this.shouldScrollBottom = node.scrollTop + node.offsetHeight >= node.scrollHeight
    }
  }
  componentDidUpdate () {
    if (this.shouldScrollBottom) {
      this.scrollToBottom()
    }
  }
  render () {
    return this.props.child
  }
}
