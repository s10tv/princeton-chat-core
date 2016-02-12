/*eslint-disable no-trailing-spaces */
import React, {PropTypes} from 'react'
import Radium from 'radium'
import {TextField, SelectField, MenuItem, FlatButton} from '/client/lib/ui.jsx'
import {color, spacing, fontSize} from '/client/config/theme'
import style from './style'
import Layout from './layout'

const Home = (props) => {
  const {fields: {netid, domain}, handleSubmit} = props
  return (
    <Layout.Window>
      <Layout.Sidebar>
        <header style={style.sidebarHeader}>
          <a style={style.sidebarLink} href='/login'>Log in</a>
        </header>
        <div style={style.sidebarInner}>
          <h1 style={s.mainLogo}>Princeton.Chat</h1>
          <p>is a private community that connects Princetonians based on shared interests and common needs.</p>
          <form style={style.form} onsubmit={handleSubmit}>
            <div style={s.emailContainer}>
              <TextField hintText='netid' {...netid} />
              <span>@</span>
              <SelectField {...domain} >
                <MenuItem value='alumni.princeton.edu' primaryText='alumni.princeton.edu' />
                <MenuItem value='princeton.edu' primaryText='princeton.edu' />
              </SelectField>
            </div>
            <br />
            <a style={s.manualInvite} href='/o/request-invite' tooltip='No worries. We can verify you manually.'>
              Don't have access to your Princeton email?
            </a>
            <br />
            <br />
            <FlatButton style={style.button} label='Get Invited'
                        backgroundColor={color.green} hoverColor={color.lightGreen} />
          </form>
        </div>
      </Layout.Sidebar>
      <Layout.Main>
      </Layout.Main>
    </Layout.Window>
  )
}
// TODO: Specify the shape of a field
Home.propTypes = {
  fields: PropTypes.shape({
    netid: PropTypes.object.isRequired,
    domain: PropTypes.object.isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
}
const s = {
  mainLogo: {
    fontWeight: 'normal',
    marginBottom: spacing.x2,
    color: color.brandPrimary,
  },
  emailContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  manualInvite: {
    color: color.white,
    fontSize: fontSize.xs,
  },
}
export default Radium(Home)
