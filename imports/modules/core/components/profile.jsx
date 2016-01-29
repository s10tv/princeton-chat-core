import React from 'react'
import {Flex, Block} from 'jsxstyle'
import Paper from 'material-ui/lib/paper'
import Card from 'material-ui/lib/card/card'
import Dialog from 'material-ui/lib/dialog';

const UserDetails = (props) => (
  <Paper>
    <section className='profile-header'>
      <Flex flexDirection='column' alignItems='center' justifyContent='center' position='relative'
        padding='36px'>
        <img src={props.user.avatar.url} className='profile-avatar' />
        <h1>{props.user.displayName}</h1>
        <h3>@{props.user.username}</h3>
        <p>{props.user.emails[0].address}</p>
      </Flex>
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
