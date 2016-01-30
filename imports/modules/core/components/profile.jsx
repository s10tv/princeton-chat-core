import React from 'react'
import {Flex, Block} from 'jsxstyle'
import Paper from 'material-ui/lib/paper'
import Card from 'material-ui/lib/card/card'
import Dialog from 'material-ui/lib/dialog';

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
    user: React.PropTypes.object,
  },

  render() {
    // User must be in session in order to display a profile.
    if (!this.props.user) {
      return null;
    }

    return (
      <Dialog
        open={this.props.isOpen && this.props.user }
        modal={false}
        onRequestClose={this.props.handleClose}>
          <Paper>
            <section className='profile-header'>
              <div className='profile-cover' />
              <Flex flexDirection='column' alignItems='center' justifyContent='center' position='relative'
                padding='36px'>
                <img src={this.props.user.avatar.url} className='profile-avatar' />
                <h2>{this.props.user.displayName}</h2>
                <h3>@{this.props.user.username}</h3>
              </Flex>
            </section>
            <section className='profile-info'>
              <div className='profile-info-table'>
                <div className="row">
                  <label>Email</label>
                  <span>{this.props.user.emails[0].address}</span>
                </div>
              </div>
            </section>
          </Paper>
      </Dialog>
    )
  }
})
