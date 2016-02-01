import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import TextField from 'material-ui/lib/text-field';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Divider from 'material-ui/lib/divider';
import {Flex} from 'jsxstyle';
import _ from 'underscore';

export default class EditProfileModal extends React.Component {
  render() {
    const {
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
      changeAvatarToDefault } = this.props;

    const toolbar =
      <Toolbar>
        <ToolbarGroup float="left">
          <ToolbarTitle text="Edit Profile" />
        </ToolbarGroup>
        <ToolbarGroup float="right" lastChild={true}>
          <RaisedButton label="Cancel" secondary={true} onTouchTap={handleClose} style={{marginRight: 0}} />
          <RaisedButton label="Done" primary={true} onTouchTap={handleSubmit} />
        </ToolbarGroup>
      </Toolbar>

    return (
      <Dialog
        title={toolbar}
        modal={false}
        open={isOpen}
        onRequestClose={handleClose}>
        <Flex flexDirection="column">
          <Flex flexDirection="row" justifyContent="space-around">
            <Flex flexDirection='column' alignItems='center' justifyContent='center'>
              <TextField floatingLabelText="First Name" onChange={firstNameUpdate} defaultValue={firstName} maxLength={50} />
              <TextField floatingLabelText="Last Name" onChange={lastNameUpdate} defaultValue={lastName} maxLength={50} />
              <TextField floatingLabelText="Username" onChange={usernameUpdate} defaultValue={username} maxLength={20} />
              <SelectField floatingLabelText="Class Year" value={classYear} onChange={handleClassYearChange} maxHeight={300}>
                {_.range(1920, (new Date()).getFullYear())
                  .map((year) => <MenuItem key={year} value={year} primaryText={year} />)}
              </SelectField>
             </Flex>
            <Flex flexDirection='column' alignItems='center' justifyContent='space-around'>
              <img src={currentAvatarUrl} className='profile-avatar' />
              <RaisedButton label="Use Default Avatar" primary={true} onTouchTap={changeAvatarToDefault} />
              <RaisedButton label="Use Facebook Photo" secondary={true} backgroundColor='#3b5998' onTouchTap={changeAvatarToFacebook} />
            </Flex>
          </Flex>
          <Divider style={{marginTop: 40}} />
          <Flex flexDirection="column" alignItems='center'>
            <TextField type="password" floatingLabelText="Current Password" onChange={handleOldPasswordChange} />
            <TextField type="password" floatingLabelText="New Password" onChange={handleNewPasswordChange} />
            <FlatButton primary={true} label='Change Password' onTouchTap={changePassword} style={{marginTop: 10}}/>
          </Flex>
        </Flex>
      </Dialog>
    );
  }
};
