import React from 'react'
import { Flex } from 'jsxstyle'
import { UserAvatar } from '/client/lib/helpers.jsx'
import styles from '/client/modules/core/components/styles.jsx'
import {classYears} from '/lib/data'
import MenuItem from '../../../../node_modules/material-ui/lib/menus/menu-item'
import Divider from '../../../../node_modules/material-ui/lib/divider'
import color from '/client/configs/color'
import {TextField, RaisedButton, FlatButton, SelectField} from '/client/lib/ui.jsx'

const s = {
  header: {
    fontWeight: 300,
    color: color.black,
    marginTop: 16,
    marginBottom: 16
  },
  content: {
    marginLeft: 16,
    marginRight: 16
  },
  mobileButtons: {
    marginTop: 20,
    marginBottom: 5
  }
}

export default React.createClass({
  propTypes: {
    /**
     * Function to call to dismiss the dialog box.
     */
    handleClose: React.PropTypes.func.isRequired,

    /**
     * Function to call to tigger logout action.
     */
    onLogout: React.PropTypes.func.isRequired,

    /**
     * The (current) user whos profile will be displayed.
     */
    user: React.PropTypes.object,

    /**
     * True if this modal is showing.
     */
    isOpen: React.PropTypes.bool,

    handleOldPasswordChange: React.PropTypes.func,
    handleNewPasswordChange: React.PropTypes.func,
    changePassword: React.PropTypes.func,
    changeAvatarToFacebook: React.PropTypes.func,
    changeAvatarToDefault: React.PropTypes.func,

    fields: React.PropTypes.shape({
      firstName: React.PropTypes.object.isRequired,
      lastName: React.PropTypes.object.isRequired,
      displayName: React.PropTypes.object.isRequired,
      classYear: React.PropTypes.object.isRequired,
      username: React.PropTypes.object.isRequired
    }).isRequired,

    handleSubmit: React.PropTypes.func
  },

  componentWillMount () {
    document.body.style.overflow = 'auto'
  },

  componentWillUnmount () {
    document.body.style.overflow = 'hidden'
  },

  render () {
    const {
      user,
      handleSubmit,
      handleOldPasswordChange,
      handleNewPasswordChange,
      changePassword,
      changeAvatarToFacebook,
      changeAvatarToDefault,
      fields: {firstName, lastName, displayName, username, classYear}} = this.props

    if (!user) {
      return null
    }

    return (
      <main className='no-scrollbar' style={Object.assign({}, styles.main, {
        maxWidth: 800,
        margin: '0 auto'
      })}>
        <div flexDirection='column' style={s.content}>
          <h1 style={s.header}>My Profile</h1>
          <Flex flexDirection='row' justifyContent='space-around' flexWrap='wrap'>
            <Flex flexDirection='column' alignItems='center' justifyContent='flex-start'>
              <UserAvatar size={150} avatar={user.avatar} avatarInitials={user.avatarInitials} />
              <RaisedButton label='Use Default Avatar' primary
                backgroundColor={color.gray}
                onTouchTap={changeAvatarToDefault}
                fullWidth
                style={s.mobileButtons} />
              <RaisedButton label='Use Facebook Photo'
                secondary
                backgroundColor='#3b5998'
                onTouchTap={changeAvatarToFacebook}
                fullWidth
                style={s.mobileButtons} />
            </Flex>

            <form>
              <Flex flexDirection='column' alignItems='center' justifyContent='center'>
                <TextField floatingLabelText='First Name' {...firstName} />
                <TextField floatingLabelText='Last Name' {...lastName} />
                <TextField floatingLabelText='Full Name' {...displayName} />
                <TextField floatingLabelText='Username' {...username} />
                <SelectField floatingLabelText='Class Year' maxHeight={300} {...classYear}>
                  {classYears.map((year) => <MenuItem key={year} value={year} primaryText={year} />)}
                </SelectField>
                <Flex alignSelf='flex-end' style={{marginTop: 20}}>
                  <FlatButton label='Update Profile' primary onTouchTap={handleSubmit} />
                </Flex>
              </Flex>
            </form>
          </Flex>
          <Divider style={{marginTop: 40}} />
          <h1 style={s.header}>Reset Password</h1>
          <Flex flexDirection='column' alignItems='flex-start' style={{paddingBottom: 20}}>
            <TextField
              type='password'
              fullWidth
              floatingLabelText='Current Password'
              onChange={handleOldPasswordChange} />
            <TextField
              type='password'
              fullWidth
              floatingLabelText='New Password'
              onChange={handleNewPasswordChange} />

            <Flex alignSelf='flex-end'>
              <FlatButton primary
                label='Change Password'
                onTouchTap={changePassword}
                style={{marginTop: 10}} />
            </Flex>
          </Flex>
        </div>
      </main>
    )
  }
})
