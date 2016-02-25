import React from 'react'
import {Flex} from 'jsxstyle'
import LeftNav from '../../../../../node_modules/material-ui/lib/left-nav'
import List from '../../../../../node_modules/material-ui/lib/lists/list'
import ListItem from '../../../../../node_modules/material-ui/lib/lists/list-item'
import {SmallListItem, MediumListItem, LetterAvatar, CoverAvatar} from '/client/modules/core/components/helpers.jsx'
import RaisedButton from '../../../../../node_modules/material-ui/lib/raised-button'
import FontIcon from '../../../../../node_modules/material-ui/lib/font-icon'
import ExitToApp from 'material-ui/lib/svg-icons/action/exit-to-app'
import Person from 'material-ui/lib/svg-icons/social/person'
import Popover from 'material-ui/lib/popover/popover'
import { i18n } from '/client/configs/env'

const primaryTheme = i18n('primaryMuiTheme')
const theme = i18n('secondaryMuiTheme')
const accent1Color = theme.baseTheme.palette.accent1Color
const primary3Color = theme.baseTheme.palette.primary3Color

const s = {
  popover: {
    backgroundColor: 'unset'
  },
  settings: {
    item: {
    }
  }
}

const PopOverList = React.createClass({
  propTypes: {
    onTapSettings: React.PropTypes.func.isRequired,
    onLogout: React.PropTypes.func.isRequired,
    closePopover: React.PropTypes.func.isRequired
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext () {
    return {
      muiTheme: primaryTheme
    }
  },

  render () {
    return (
      <List>
        <ListItem primaryText='Edit Profile'
          leftIcon={<Person />}
          onTouchTap={() => {
            this.props.closePopover()
            this.props.onTapSettings()
          }} />
        <ListItem primaryText='Logout'
          leftIcon={<ExitToApp />}
          onTouchTap={() => {
            this.props.closePopover()
            this.props.onLogout()
          }} />
      </List>
    )
  }
})

const SidebarHeader = React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired
  },

  getInitialState () {
    return {
      open: false
    }
  },

  onTapHeader (event) {
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    })
  },

  closePopover () {
    this.setState({
      open: false
    })
  },

  render () {
    const props = this.props

    return (
      <Flex flexShrink={0} flexDirection='column'>
        <ListItem id='sidebar-header'
          innerDivStyle={{
            paddingTop: 8,
            paddingRight: 8,
            paddingBottom: 8,
            paddingLeft: 8
          }} onTouchTap={this.onTapHeader}>
          <Flex>
            {props.user.avatar.isDefaultAvatar
              ? <LetterAvatar
                color='white'
                backgroundColor={props.user.avatar.color}
                size={60}>
                {props.user.avatarInitials}
              </LetterAvatar>
              : <CoverAvatar src={props.user.avatar.url} size={60} />
            }
            <Flex
              flexGrow={1}
              marginLeft={8}
              flexDirection='column'
              justifyContent='space-around'>
              <h3 style={Object.assign({}, { color: accent1Color })}>
                {i18n('title')}
              </h3>
              <Flex alignItems='center' style={{ overflow: 'hidden' }}>
                <span style={{ width: 120, lineHeight: '24px', textOverflow: 'ellipsis',
                  overflow: 'hidden'}}>
                  {props.user.displayName}
                </span>
                <FontIcon className='material-icons' style={{marginLeft: 'auto'}}>expand_more</FontIcon>
              </Flex>
            </Flex>
          </Flex>
        </ListItem>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          onRequestClose={this.closePopover}
          style={s.popover}
        >
          <PopOverList {...this.props} closePopover={this.closePopover} />
        </Popover>
      </Flex>
    )
  }
})

const NonTappableSubHeader = ({label}) => (
  <div style={{
    width: '100%',
    paddingLeft: 4,
    paddingRight: 16,
    color: primary3Color,
    fontWeight: 'normal'}}>
    <span>{label}</span>
  </div>
)

const AddNewPostButton = ({ onClick }) => (
  <Flex marginTop='15' marginBottom='7' flexShrink={0}>
    <RaisedButton id='new-post' primary label='New Post' labelPosition='after' onClick={onClick}
      style={{margin: '0px auto'}}>
      <FontIcon className='material-icons' color='white'
        style={{
          verticalAlign: 'middle',
          height: '100%',
          marginLeft: 8
        }}>
         add_circle
      </FontIcon>
    </RaisedButton>
  </Flex>
)

export default React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired,
    followedTopics: React.PropTypes.array.isRequired,
    showTopic: React.PropTypes.func.isRequired,
    navigateTo: React.PropTypes.func.isRequired,
    showAddPostPopupFn: React.PropTypes.func.isRequired,
    currentRouterPath: React.PropTypes.string.isRequired,
    onTapSettings: React.PropTypes.func.isRequired,
    showAllTopics: React.PropTypes.func.isRequired,
    isFullAdmin: React.PropTypes.bool.isRequired,
    clickedToShowSidebar: React.PropTypes.bool.isRequired
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext () {
    return {
      muiTheme: theme
    }
  },

  giveListItemStyleForRoutePath (routeName) {
    return (`/${routeName}` === this.props.currentRouterPath) ? {
      backgroundColor: primary3Color
    } : {}
  },

  render () {
    const width = this.props.clickedToShowSidebar ? '100%' : '240px'

    return (
      <LeftNav open={this.props.sidebarOpen} style={{width}}>
        <SidebarHeader
          user={this.props.user}
          onLogout={this.props.onLogout}
          onTapSettings={this.props.onTapSettings} />
        <AddNewPostButton onClick={this.props.showAddPostPopupFn}/>
        <nav className='no-scrollbar' style={{flexGrow: 1, overflow: 'scroll'}}>
          <List>
            {!this.props.isFullAdmin
              ? null
              : <MediumListItem
                style={this.giveListItemStyleForRoutePath('admin/invite')}
                onTouchTap={() => this.props.navigateTo('/admin/invite')}>
                Admin
              </MediumListItem>
            }

            <MediumListItem
              style={this.giveListItemStyleForRoutePath('all-mine')}
              onTouchTap={() => this.props.navigateTo('all-mine')}>
                My Feed
            </MediumListItem>

            <MediumListItem
              style={this.giveListItemStyleForRoutePath('all')}
              onTouchTap={() => this.props.navigateTo('all')}>
                All Posts
            </MediumListItem>

            <MediumListItem
              style={this.giveListItemStyleForRoutePath('choose-topics')}
              onTouchTap={this.props.showAllTopics}>
              Explore Channels
            </MediumListItem>

          </List>
          <List subheader={
            <NonTappableSubHeader label='MY CHANNELS' />
          }>
            {this.props.followedTopics.map((topic) =>
              <SmallListItem
                key={topic._id}
                style={this.giveListItemStyleForRoutePath(`topics/${topic._id}`)}
                onTouchTap={() => { this.props.showTopic(topic._id) }}>
                    # {topic.displayName}
              </SmallListItem>
            )}
          </List>
        </nav>
      </LeftNav>
    )
  }
})
