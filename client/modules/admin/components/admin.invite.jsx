import React from 'react'

import {Flex} from 'jsxstyle'
import {FlatButton} from '/client/lib/ui.jsx'
import styles from '/client/modules/core/components/styles.jsx'

export default React.createClass({
  propTypes: {
    /**
     * Determines whether to expand the content to 100% or make room for sidebar.
     */
    sidebarOpen: React.PropTypes.bool.isRequired,

    /**
     * All of the invites
     */
    invites: React.PropTypes.array.isRequired,
    sendInvite: React.PropTypes.func.isRequired
  },

  render () {
    return (
      <main style={Object.assign({}, styles.main, {
        marginLeft: this.props.sidebarOpen ? 240 : 0,
        padding: 20
      })}>
        <Flex flexDirection='column' alignItems='center' overflowY='scroll'>
          <h1>Manage Invites</h1>
          <table style={{ maxWidth: 500 }}>
            <tbody>
              {this.props.invites.map((invite) => {
                return <Invite key={invite._id} invite={invite} {...this.props} />
              })}
            </tbody>
          </table>
        </Flex>
      </main>
    )
  }
})

const Invite = (props) => {
  const {invite} = props
  return (
    <tr>
      <td style={s.cell}>{invite.status}</td>
      <td style={s.cell}>{invite.email}</td>
      <td style={s.cell}>{invite.firstName}</td>
      <td style={s.cell}>{invite.lastName}</td>
      <td style={s.cell}>{invite.birthDate}</td>
      <td style={s.cell}>{invite.classYear}</td>
      <td style={s.cell}>{invite.degree}</td>
      <td style={s.cell}>
        <FlatButton
          label='Invite'
          primary
          onTouchTap={() => props.sendInvite(invite._id)} />
      </td>
    </tr>
  )
}

var s = {
  cell: {
    padding: 10
  }
}
