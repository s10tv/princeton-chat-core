import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';

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
  },

  render() {
    const { handleClose, onLogout } = this.props;

    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={handleClose} />,
      <FlatButton
        label="Yes"
        primary={true}
        keyboardFocused={true}
        onTouchTap={onLogout} />,
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
})
