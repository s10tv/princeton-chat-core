/*eslint-disable no-trailing-spaces */
import React, {PropTypes} from 'react'
import Radium from 'radium'
import {TextField, SelectField, MenuItem, FlatButton} from '/client/lib/ui.jsx'
import {color} from '/client/config/theme'
import style from './style'
import Layout from './layout'
import {Link} from 'react-router'


const Home = (props) => {
  const {fields: {netid, domain}, handleSubmit} = props
  return (
    <Layout.Window>
      <Layout.Sidebar>
        <header style={style.sidebarHeader}>
          <a style={style.login} href='/login'>Log in</a>
        </header>
        <div style={style.sidebarInner}>
          <h1 style={style.h1}>Princeton.Chat</h1>
          <p>is a private community that connects Princetonians based on shared interests and common needs.</p>
          <form style={style.verifyForm} onsubmit={handleSubmit}>
            <div style={style.emailContainer}>
              <TextField hintText='netid' {...netid} />
              <span>@</span>
              <SelectField {...domain} >
                <MenuItem value='alumni.princeton.edu' primaryText='alumni.princeton.edu' />
                <MenuItem value='princeton.edu' primaryText='princeton.edu' />
              </SelectField>
            </div>
            <br />
            <Link to='/o/request-invite'>Request Invite</Link>
            <a style={style.manualInvite} href='/o/request-invite' tooltip='No worries. We can verify you manually.'>
              Don't have access to your Princeton email?
            </a>
            <br />
            <br />
            <FlatButton style={style.submitButton} label='Get Invited' 
              backgroundColor={color.green} hoverColor={color.lightGreen} />
          </form>
        </div>
      </Layout.Sidebar>
      <Layout.Main>
      </Layout.Main>
    </Layout.Window>
  )
}
Home.propTypes = {
  fields: PropTypes.shape({
    netid: PropTypes.object.isRequired,
    domain: PropTypes.object.isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
}
export default Radium(Home)
