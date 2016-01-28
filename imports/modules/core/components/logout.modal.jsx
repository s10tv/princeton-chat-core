import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';

export default class LogoutModal extends React.Component {
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={this.props.handleClose} />,
      <FlatButton
        label="Yes"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.props.onLogout} />,
    ];

    return (
      <Dialog
        title="My Account"
        actions={actions}
        modal={false}
        open={this.props.isOpen}
        onRequestClose={this.props.handleClose}>
        Would you like to log out?
      </Dialog>
    );
  }
}
