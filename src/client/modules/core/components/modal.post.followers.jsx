import React from 'react'
import Toolbar from 'material-ui/lib/toolbar/toolbar'
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group'
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import Dialog from 'material-ui/lib/dialog'
import IconButton from 'material-ui/lib/icon-button'
import FontIcon from 'material-ui/lib/font-icon'
import {UserAvatar} from 'client/modules/core/components/helpers.jsx'

export default class PostFollowersModal extends React.Component {
  render () {
    const {
      closeModal,
      followers,
      isOpen,
      showUserProfile
    } = this.props

    const toolbar =
      <Toolbar>
        <ToolbarGroup float='left'>
          <ToolbarTitle text='Followers' />
        </ToolbarGroup>
        <ToolbarGroup float='right' style={{top: '50%', transform: 'translateY(-50%)'}}>
          <IconButton tooltip='Close' onTouchTap={closeModal}>
            <FontIcon className='material-icons'>clear</FontIcon>
          </IconButton>
        </ToolbarGroup>
      </Toolbar>

    return (
      <Dialog
        title={toolbar}
        modal={false}
        open={isOpen}
        onRequestClose={closeModal}
        bodyClassName={'no-scrollbar'}
        bodyStyle={{overflow: 'scroll'}}>
        <List>
          {followers.map((follower) =>
            <ListItem
              key={follower._id}
              onTouchTap={() => showUserProfile(follower)}
              primaryText={follower.displayEmail}
              leftAvatar={<UserAvatar
                avatar={follower.avatar}
                avatarInitials={follower.avatarInitials} />
              }
            />
          )}
        </List>
      </Dialog>
    )
  }
}

PostFollowersModal.propTypes = {
  // /**
  //  * Proptypes are also indirectly passed to Menu
  //  */

  // Modal view closing handler
  closeModal: React.PropTypes.func.isRequired,

  // A list of followers to render
  followers: React.PropTypes.array.isRequired,

  // Show/Hide Modal view
  isOpen: React.PropTypes.bool.isRequired,

  /**
   * Func to show user profile modal
   */
  showUserProfile: React.PropTypes.func.isRequired
}
