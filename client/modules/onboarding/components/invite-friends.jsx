/*eslint-disable no-trailing-spaces */
import React, { PropTypes } from 'react'
import Radium from 'radium'
import {TextField, FlatButton, FontIcon, IconButton} from '/client/lib/ui.jsx'
import {color, spacing} from '/client/config/theme'
import style from './style'
import Layout from './layout'

// NOTE: addField / removeField provided by redux-form http://erikras.github.io/redux-form/#/examples/deep
class InviteFriends extends React.Component {

  onVerifyAffiliation (event) {
    event.preventDefault()
    this.props.verifyAffiliation()
  }

  render () {
    const {fields: {invitees}} = this.props
    return (
      <Layout.Window>
        <Layout.Sidebar>
          <header style={style.sidebarHeader}>
            <span style={style.sidebarLogo}>Princeton.Chat</span>
            <a style={style.sidebarLink} href='/o/'>Back</a>
          </header>
          <div style={style.sidebarInner}>
            <h2>Better with friends</h2>
            <p>
              Who were your three best friends from Princeton? Get them to join you on Princeton.Chat.
            </p>
            <form style={s.inviteForm} onSubmit={this.onVerifyAffiliation.bind(this)}>
              {invitees.map(({email, firstName, lastName}, index) =>
                <div key={index} style={s.row}>
                  <TextField floatingLabelText='Email' {...email} />
                  <div style={style.horizontalSpacer} />
                  <TextField floatingLabelText='First Name' hintText='(optional)' {...firstName} />
                  <div style={style.horizontalSpacer} />
                  <TextField floatingLabelText='Last Name' hintText='(optional)' {...lastName} />
                  <IconButton onTouchTap={() => invitees.removeField(index)}>
                    <FontIcon className='material-icons'>close</FontIcon>
                  </IconButton>
                </div>
              )}
              <FlatButton label='Add Another' onTouchTap={() => invitees.addField()}/>
              <br />
              <FlatButton type='submit' style={style.button} label='Invite'
                          backgroundColor={color.green} hoverColor={color.lightGreen} />
            </form>
          </div>
        </Layout.Sidebar>
        <Layout.Main>
        </Layout.Main>
      </Layout.Window>
    )
  }
}

const inviteeShape = PropTypes.shape({
  firstName: PropTypes.object.isRequired,
  lastName: PropTypes.object.isRequired,
  email: PropTypes.object.isRequired,
})

InviteFriends.propTypes = {
  fields: PropTypes.shape({
    invitees: PropTypes.arrayOf(inviteeShape).isRequired
  }).isRequired,
  verifyAffiliation: PropTypes.func.isRequired
}

const s = {
  row: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  inviteForm: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginBottom: spacing.x6,
  },
}
export default Radium(InviteFriends)
