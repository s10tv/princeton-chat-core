/*eslint-disable no-trailing-spaces */
import React, { PropTypes } from 'react'
import Radium from 'radium'
import {TextField, FlatButton, FontIcon, IconButton, PageControl} from '/client/lib/ui.jsx'
import {color, spacing} from '/client/configs/theme'
import style from '../configs/style'
import Layout from './layout'

// NOTE: addField / removeField provided by redux-form http://erikras.github.io/redux-form/#/examples/deep
class InviteFriends extends React.Component {

  render () {
    const {fields: {invitees}, handleSubmit} = this.props
    return (
      <Layout.Window>
        <Layout.Sidebar>
          <header style={style.sidebarHeader}>
            <span style={style.sidebarLogo}>Princeton.Chat</span>
          </header>
          <div style={style.sidebarInner}>
            <h1 style={style.h1}>Better with friends</h1>
            <p>
              Who were your three best friends from Princeton? Get them to join you on Princeton.Chat.
            </p>
            <form style={style.form} onSubmit={handleSubmit}>
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
                        <PageControl total={3} current={2} />
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
  email: PropTypes.object.isRequired
})

InviteFriends.propTypes = {
  fields: PropTypes.shape({
    invitees: PropTypes.arrayOf(inviteeShape).isRequired
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired
}

const s = {
  row: {
    display: 'flex',
    alignItems: 'flex-end',
  },
}
export default Radium(InviteFriends)
