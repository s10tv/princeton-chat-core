import React from 'react'
import Dialog from 'material-ui/lib/dialog'
import FlatButton from 'material-ui/lib/flat-button'
import RaisedButton from 'material-ui/lib/raised-button'
import Toolbar from 'material-ui/lib/toolbar/toolbar'
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group'
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title'
import TextField from 'material-ui/lib/text-field'
import SelectField from 'material-ui/lib/select-field'
import MenuItem from 'material-ui/lib/menus/menu-item'
import Divider from 'material-ui/lib/divider'
import {Flex} from 'jsxstyle'
import _ from 'underscore'
import Avatar from 'material-ui/lib/avatar'
import {LetterAvatar} from '/imports/modules/core/components/helpers.jsx'

export default React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    handleClose: React.PropTypes.func,
    isOpen: React.PropTypes.bool,
    handleSubmit: React.PropTypes.func,
    firstName: React.PropTypes.string,
    lastName: React.PropTypes.string,
    username: React.PropTypes.string,
    firstNameUpdate: React.PropTypes.func,
    lastNameUpdate: React.PropTypes.func,
    usernameUpdate: React.PropTypes.func,
    handleOldPasswordChange: React.PropTypes.func,
    handleNewPasswordChange: React.PropTypes.func,
    changePassword: React.PropTypes.func,
    handleClassYearChange: React.PropTypes.func,
    classYear: React.PropTypes.number,
    currentAvatarUrl: React.PropTypes.string,
    changeAvatarToFacebook: React.PropTypes.func,
    changeAvatarToDefault: React.PropTypes.func,
    isDefaultAvatar: React.PropTypes.bool
  },

  render () {
    const {
      user,
      handleClose,
      isOpen,
      handleSubmit,
      firstName,
      lastName,
      username,
      firstNameUpdate,
      lastNameUpdate,
      usernameUpdate,
      handleOldPasswordChange,
      handleNewPasswordChange,
      changePassword,
      handleClassYearChange,
      classYear,
      currentAvatarUrl,
      changeAvatarToFacebook,
      changeAvatarToDefault,
      isDefaultAvatar } = this.props

    const toolbar =
      <Toolbar>
        <ToolbarGroup float='left'>
          <ToolbarTitle text='Edit Profile' />
        </ToolbarGroup>
        <ToolbarGroup float='right' lastChild>
          <RaisedButton label='Cancel' secondary onTouchTap={handleClose}
            style={{marginRight: 0}} />
          <RaisedButton label='Done' primary onTouchTap={handleSubmit} />
        </ToolbarGroup>
      </Toolbar>

    return (
      <Dialog title={toolbar} modal={false} open={isOpen} onRequestClose={handleClose}>
        <Flex flexDirection='column'>
          <Flex flexDirection='row' justifyContent='space-around'>
            <Flex flexDirection='column' alignItems='center' justifyContent='center'>
              <TextField floatingLabelText='First Name' onChange={firstNameUpdate}
                defaultValue={firstName} maxLength={50} />
              <TextField floatingLabelText='Last Name' onChange={lastNameUpdate}
                defaultValue={lastName} maxLength={50} />
              <TextField floatingLabelText='Username' onChange={usernameUpdate}
                defaultValue={username} maxLength={20} />
              <SelectField floatingLabelText='Class Year' value={classYear}
                 onChange={handleClassYearChange} maxHeight={300}>
                {_.range(1920, (new Date()).getFullYear())
                  .map((year) => <MenuItem key={year} value={year} primaryText={year} />)}
              </SelectField>
             </Flex>
            <Flex flexDirection='column' alignItems='center' justifyContent='space-around'>
              { isDefaultAvatar
                ? <LetterAvatar size={150} color='white' backgroundColor={user.avatar.color}>
                    {user.avatarInitials}
                  </LetterAvatar>
                : <Avatar size={150} src={currentAvatarUrl} />
              }
              <RaisedButton label='Use Default Avatar' primary
                onTouchTap={changeAvatarToDefault} />
              <RaisedButton label='Use Facebook Photo' secondary backgroundColor='#3b5998'
                onTouchTap={changeAvatarToFacebook} />
            </Flex>
          </Flex>
          <Divider style={{marginTop: 40}} />
          <Flex flexDirection='column' alignItems='center'>
            <TextField type='password' floatingLabelText='Current Password'
              onChange={handleOldPasswordChange} />
            <TextField type='password' floatingLabelText='New Password'
              onChange={handleNewPasswordChange} />
            <FlatButton primary label='Change Password' onTouchTap={changePassword}
              style={{marginTop: 10}}/>
          </Flex>
        </Flex>
      </Dialog>
    )
  }
})
