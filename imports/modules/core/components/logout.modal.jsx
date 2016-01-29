import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import {Flex} from 'jsxstyle';

export default class LogoutModal extends React.Component {
  render() {
    const { handleClose, onLogout, isOpen, user, editProfile } = this.props;

    const toolbar =
      <Toolbar>
        <ToolbarGroup float="left">
          <ToolbarTitle text="Settings" />
        </ToolbarGroup>
        <ToolbarGroup float="right" lastChild={true}>
          <RaisedButton label="Done" primary={true} onTouchTap={handleClose} />
        </ToolbarGroup>
      </Toolbar>

    return (
      <Dialog
        title={toolbar}
        modal={false}
        open={isOpen}
        onRequestClose={handleClose}>
        <section className='profile-header'>
          <Flex flexDirection='column' alignItems='center' justifyContent='center' position='relative'
            padding='36px'>
            <img src={user.avatar.url} className='profile-avatar' />
            <h1>{user.displayName}</h1>
            <h3>{user.displayUsername}</h3>
            <p>{user.emails[0].address}</p>
            <p className='profile-edit'><a href="#" onClick={editProfile}>Edit Profile</a> | <a href="#" onClick={onLogout}>Logout</a></p>
          </Flex>
        </section>
      </Dialog>
    );
  }
}
