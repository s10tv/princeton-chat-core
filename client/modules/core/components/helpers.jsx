import React from 'react'
import ListItem from '../../../../node_modules/material-ui/lib/lists/list-item'
import Avatar from '../../../../node_modules/material-ui/lib/avatar'
import CircularProgress from '../../../../node_modules/material-ui/lib/circular-progress'
import ReactDOM from 'react-dom'
import Radium, {StyleRoot} from 'radium'

// Helpers

const LoadingWrapper = () => (
  <StyleRoot>
    <LoadingComponent />
  </StyleRoot>
)

var LoadingComponent = () => (
  <div style={{
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100vh',
    marginLeft: 240,
    '@media (max-width: 768px)': {
      marginLeft: 0
    }}}>
    <span style={{color: 'gray'}}>Loading...</span>
    <CircularProgress />
  </div>
)

LoadingComponent = Radium(LoadingComponent)

export const Loading = Radium(LoadingWrapper)

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
    fontWeight: 200
  }, props.style)}>
    {props.children}
  </CoverAvatar>
)

export const LetterAvatar = (props) => (
  <Avatar {...props} style={Object.assign({}, {fontWeight: 200}, props.style)}>
    {props.children}
  </Avatar>
)

export const CoverAvatar = (props) => (
  <Avatar {...props} style={Object.assign({objectFit: 'cover'}, props.style)}>
    {props.children}
  </Avatar>
)

export const UserAvatar = ({avatar, avatarInitials, size}) => (
  avatar.isDefaultAvatar
  ? <LetterAvatar size={size || 50} color='white'
    backgroundColor={avatar.color}>
    {avatarInitials}
  </LetterAvatar>
  : <CoverAvatar size={size || 50} src={avatar.url} />
)

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
