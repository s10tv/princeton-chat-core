import React from 'react'
import {Flex, Block} from 'jsxstyle'
import Paper from 'material-ui/lib/paper'
import Card from 'material-ui/lib/card/card'
import Dialog from 'material-ui/lib/dialog';

const UserDetails = (props) => (
  <Paper>
    <section className='profile-header'>
      <div className='profile-cover' />
      <Flex flexDirection='column' alignItems='center' justifyContent='center' position='relative'
        padding='36px'>
        <img src={props.user.avatar.url} className='profile-avatar' />
        <h2>{props.user.displayName}</h2>
        <h3>@{props.user.username}</h3>
        <p>I wish i was a little bit taller, wish i was a baller, wish i had a girl… also.</p>
      </Flex>
    </section>
    <section className='profile-info'>
      <h3>Followed Topics</h3>
      <ul>
        <li>#economics</li>
        <li>#consulting</li>
        <li>#firefly</li>
        <li>#random</li>
      </ul>
      <div className='profile-info-table'>
        <div className="row">
          <label>User #</label>
          <span>3</span>
        </div>
        <div className="row">
          <label>Email that is super long</label>
          <span>tonyx.xiddda.h2222.sa@alumni.princeton.edu</span>
        </div>
        <div className="row">
          <label>Last active</label>
          <span>Yesterday</span>
        </div>
        <div className="row">
          <label>Email</label>
          <span>tonyx.ca@alumni.princeton.edu</span>
        </div>
      </div>
    </section>
  </Paper>
)


export default React.createClass({
  render() {
    return (
      <Dialog
        open={this.props.isOpen}
        actions={[]}
        modal={false}
        onRequestClose={this.props.handleClose}>
          { !this.props.user ? null : <UserDetails user={this.props.user} /> }
      </Dialog>
    )
  }
})
