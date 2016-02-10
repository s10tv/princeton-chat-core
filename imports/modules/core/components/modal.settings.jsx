import React from 'react'
import Dialog from 'material-ui/lib/dialog'
import Toolbar from 'material-ui/lib/toolbar/toolbar'
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group'
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title'
import { Flex } from 'jsxstyle'
import FontIcon from 'material-ui/lib/font-icon'
import IconButton from 'material-ui/lib/icon-button'
import { LetterAvatar, CoverAvatar } from '/imports/modules/core/components/helpers.jsx'

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
     * Function to call when we want to edit the profile.
     */
    editProfile: React.PropTypes.func.isRequired,

    /**
     * The (current) user whos profile will be displayed.
     */
    user: React.PropTypes.object,

    /**
     * True if this modal is showing.
     */
    isOpen: React.PropTypes.bool
  },

  render () {
    const { handleClose, onLogout, isOpen, user, editProfile } = this.props

    if (!user) {
      return null
    }

    const toolbar = (
      <Toolbar>
        <ToolbarGroup float='left'>
          <ToolbarTitle text='Settings' />
        </ToolbarGroup>
        <ToolbarGroup float='right' style={{top: '50%', transform: 'translateY(-50%)'}}>
          <IconButton tooltip='Close' onTouchTap={handleClose}>
            <FontIcon className='material-icons'>
              clear
            </FontIcon>
          </IconButton>
        </ToolbarGroup>
      </Toolbar>
    )

    return (
      <Dialog
        title={toolbar}
        modal={false}
        open={isOpen}
        onRequestClose={handleClose}>
        <section className='profile-header'>
          <Flex
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            position='relative'
            padding='36px'>
            {user.avatar.isDefaultAvatar
              ? <LetterAvatar size={150} color='white' backgroundColor={user.avatar.color}>
                 {user.avatarInitials}
              </LetterAvatar>
              : <CoverAvatar size={150} src={user.avatar.url} />}
            <h1>{user.displayName}</h1>
            <h3>{user.displayUsername}</h3>
            <p>
              {user.displayEmail}
            </p>
            <p className='profile-edit'>
              <a href='#' onClick={editProfile}>Edit Profile</a> | <a href='#' onClick={onLogout}>
                Logout
              </a>
            </p>
          </Flex>
        </section>
      </Dialog>
    )
  }
})
