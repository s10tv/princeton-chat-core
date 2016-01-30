import React from 'react';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Dialog from 'material-ui/lib/dialog';
import RaisedButton from 'material-ui/lib/raised-button';
import Avatar from 'material-ui/lib/avatar';
import Menu from '/imports/modules/core/components/menu.jsx';

export default class PostFollowersModal extends React.Component {
  propTypes: {
    // /**
    //  * Proptypes are also indirectly passed to Menu
    //  */
    // ...Menu.propTypes,

    // Modal view closing handler
    closeModal: React.PropTypes.func.isRequired,

    // A list of followers to render
    followers: React.PropTypes.array.isRequired,

    // Show/Hide Modal view
    isOpen: React.PropTypes.bool.isRequired
  }

  render() {
    const {
      closeModal,
      followers,
      isOpen,
    } = this.props;

    const toolbar =
      <Toolbar>
        <ToolbarGroup float='left'>
          <ToolbarTitle text='Followers' />
        </ToolbarGroup>
        <ToolbarGroup float='right' lastChild={true}>
          <RaisedButton label='Close' secondary={true} onTouchTap={closeModal} />
        </ToolbarGroup>
      </Toolbar>

    return (
      <Dialog
        title={toolbar}
        modal={false}
        open={isOpen}
        onRequestClose={closeModal}>
        <List>
          {followers.map((follower) => <ListItem primaryText={follower.displayName} leftAvatar={<Avatar src={follower.avatar.url} />} /> )}
        </List>
      </Dialog>
    )
  }
}
