import React from 'react'
import { Flex } from 'jsxstyle'
import Paper from '../../../../node_modules/material-ui/lib/paper'
import Dialog from '../../../../node_modules/material-ui/lib/dialog'
import { i18n } from '/client/configs/env'
import { LetterAvatar, CoverAvatar } from '/client/modules/core/components/helpers.jsx'

const theme = i18n('primaryMuiTheme')
const accent1Color = theme.baseTheme.palette.accent1Color

export default React.createClass({
  propTypes: {
    /**
     * true if the profile modal is showing.
     */
    isOpen: React.PropTypes.bool.isRequired,

    /**
     * A function to call to dismiss the modal.
     */
    handleClose: React.PropTypes.func.isRequired,

    /**
     * The user for whom the profile resembles.
     */
    user: React.PropTypes.object
  },

  render () {
    // User must be in session in order to display a profile.
    if (!this.props.user) {
      return null
    }

    return (
      <Dialog open={this.props.isOpen && this.props.user !== undefined} modal={false}
        onRequestClose={this.props.handleClose}>
        <Paper>
          <section className='profile-header'>
            <Flex
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              position='relative'
              padding='36px'>
              {this.props.user.avatar.isDefaultAvatar
                ? <LetterAvatar size={150} color='white'
                  backgroundColor={this.props.user.avatar.color}>
                   {this.props.user.avatarInitials}
                </LetterAvatar>
                : <CoverAvatar size={150} src={this.props.user.avatar.url} />}
              <h1>{this.props.user.displayName}</h1>
              {this.props.user.displayUsername.length === 0
                ? null
                : <h3 style={{ color: accent1Color }}>
                  {this.props.user.displayUsername}
                </h3>}
              <p>
                {this.props.user.displayEmail}
              </p>
            </Flex>
          </section>
        </Paper>
      </Dialog>
    )
  }
})
