import React from 'react'
import { i18n } from '/client/configs/env'
import {Flex} from 'jsxstyle'
import List from '../../../../../node_modules/material-ui/lib/lists/list'
import ListItem from '../../../../../node_modules/material-ui/lib/lists/list-item'
import {UserAvatar} from '/client/modules/core/components/helpers.jsx'
import ExitToApp from 'material-ui/lib/svg-icons/action/exit-to-app'
import Person from 'material-ui/lib/svg-icons/social/person'
import Popover from 'material-ui/lib/popover/popover'
import FontIcon from '../../../../../node_modules/material-ui/lib/font-icon'

const primaryTheme = i18n('primaryMuiTheme')
const theme = i18n('secondaryMuiTheme')
const accent1Color = theme.baseTheme.palette.accent1Color

// const primary3Color = theme.baseTheme.palette.primary3Color

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

export default React.createClass({
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
            <UserAvatar size={60} avatar={props.user.avatar}
              avatarInitials={props.user.avatarInitials} />
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
