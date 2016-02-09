import React from 'react'
import {Flex} from 'jsxstyle'
import ListItem from 'material-ui/lib/lists/list-item'
import Avatar from 'material-ui/lib/avatar'
import darkRawTheme from 'material-ui/lib/styles/raw-themes/dark-raw-theme'
import lightRawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme'
import ThemeManager from 'material-ui/lib/styles/theme-manager'
import Colors from 'material-ui/lib/styles/colors'
import Spacing from 'material-ui/lib/styles/spacing'
import ColorManipulator from 'material-ui/lib/utils/color-manipulator'
import CircularProgress from 'material-ui/lib/circular-progress'
import ReactDOM from 'react-dom'

import { i18n } from '/imports/libs/mantra'

// export const systemFont = `-apple-system, BlinkMacSystemFont,
//   "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell",
//   "Fira Sans", "Droid Sans", "Avenir Next", "Helvetica Neue",
//   sans-serif`
export const systemFont= 'Lato, sans-serif';

export const articleFont = 'medium-content-serif-font, Georgia, Cambria, "Times New Roman", Times, serif'

// Helpers

export const Loading = () => (
  <Flex flex={1} justifyContent='center' alignItems='center' flexDirection='column' marginLeft={240} height='100vh'>
    <span style={{color: 'gray'}}>Loading...</span>
    <CircularProgress />
  </Flex>
)

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
    accent1Color: i18n('primaryColor') // Princeton Orange
  },
})

export const secondaryMuiTheme = ThemeManager.getMuiTheme({
  spacing: Spacing,
  fontFamily: systemFont,
  palette: {
    ...darkRawTheme.palette,
    accent1Color: '#f07621', // Princeton Orange,
    alternateTextColor: Colors.white,
  },
})

export class ScrollingContainer extends React.Component {
  scrollToBottom() {
    const node = ReactDOM.findDOMNode(this)
    node.scrollTop = node.scrollHeight
  }
  componentDidMount() {
    this.scrollToBottom()
  }
  componentWillUpdate() {
    const node = ReactDOM.findDOMNode(this)

    if (this.props.alwaysScrollToBottom) {
      // sometimes (in case with onboarding) it is important to always scroll to the bottom
      // whenever a component is about to update.
      this.shouldScrollBottom = true;
    } else {
      // Sometimes scrollTop + offsetHeight is greater than scrollHeight.. Maybe border? >= for workaround
      this.shouldScrollBottom = node.scrollTop + node.offsetHeight >= node.scrollHeight
    }
  }
  componentDidUpdate() {
    if (this.shouldScrollBottom) {
      this.scrollToBottom()
    }
  }
  render() {
    return this.props.child
  }
}
