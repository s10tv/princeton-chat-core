import React from 'react'

import {Flex} from 'jsxstyle'
import {FlatButton} from '/src/client/lib/ui.jsx'
import styles from '/src/client/modules/core/components/styles.jsx'

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
    sendInvite: React.PropTypes.func.isRequired,
    removeInvite: React.PropTypes.func.isRequired
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
            <thead>
              <tr style={{fontWeight: 500}}>
                <td style={s.cell}>Status</td>
                <td style={s.cell}>Email</td>
                <td style={s.cell}>First Name</td>
                <td style={s.cell}>Last Name</td>
                <td style={s.cell}>Birth Date</td>
                <td style={s.cell}>Class Year</td>
                <td style={s.cell}>Degree</td>
              </tr>
            </thead>

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
    <tr style={{fontWeight: 300}}>
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
      <td style={s.cell}>
        <FlatButton
          label='Remove'
          secondary
          onTouchTap={() => props.removeInvite(invite._id)} />
      </td>
    </tr>
  )
}

const s = {
  cell: {
    padding: 10
  }
}
