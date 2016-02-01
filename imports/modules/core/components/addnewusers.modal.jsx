import React from 'react';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import TextField from 'material-ui/lib/text-field';
import Snackbar from 'material-ui/lib/snackbar';
import {Flex} from 'jsxstyle';
import _ from 'underscore';

export default React.createClass({
  propTypes: {
    // Boolean to show/hide modal
    isOpen: React.PropTypes.bool,

    // Function to close the modal
    handleClose: React.PropTypes.func,

    // Function to send invitations
    sendInvitations: React.PropTypes.func,

    // Topic to send invites to
    topicId: React.PropTypes.string,

    // Show/hide success snackbar
    isAddNewUsersSuccess: React.PropTypes.bool,

    // Function to close snackbar
    closeAddNewUsersSnackbar: React.PropTypes.func
  },

  getInitialState() {
    return {
      numEmailFields: 3
    }
  },

  addNewInvitation() {
    this.setState({
      numEmailFields: this.state.numEmailFields + 1
    });
  },

  handleClose() {
    this.setState({
      numEmailFields: 3
    });
    this.props.handleClose();
  },

  handleChange(e) {
    var nextState = this.state;
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  },

  render() {
    const {
      isOpen,
      sendInvitations,
      topicId,
      isAddNewUsersSuccess,
      closeAddNewUsersSnackbar
    } = this.props;

    const toolbar =
      <Toolbar>
        <ToolbarGroup float="left">
          <ToolbarTitle text="Send Invitations" />
        </ToolbarGroup>
        <ToolbarGroup float="right" lastChild={true}>
          <RaisedButton label="Close" secondary={true} onTouchTap={this.handleClose} />
        </ToolbarGroup>
      </Toolbar>

    return (
      <div>
        <Dialog
          title={toolbar}
          modal={false}
          actions={[
            <RaisedButton
              label="Send"
              primary={true}
              onTouchTap={() => sendInvitations(topicId, _.map(_.omit(this.state, 'numEmailFields'), (val) => val))} />
          ]}
          open={isOpen}
          onRequestClose={this.handleClose}>
          <Flex flexDirection='column' alignItems='center'>
            <List style={{maxHeight: 400, overflowY: 'scroll'}}>
              {_.range(this.state.numEmailFields).map((num) =>
                <ListItem key={num}>
                  <TextField floatingLabelText="Email" value={this.state['email' + num]} name={'email' + num} onChange={this.handleChange} hintText="pukkelpop@gmail.com"/>
                </ListItem>
              )}
            </List>
            <FlatButton primary={true} label="Add Invitation" onTouchTap={this.addNewInvitation} style={{marginTop: 15}}/>
          </Flex>
        </Dialog>
        <Snackbar
          open={isAddNewUsersSuccess}
          message="Users invited!"
          autoHideDuration={4000}
          onRequestClose={closeAddNewUsersSnackbar}/>
      </div>
    )
  }
});
