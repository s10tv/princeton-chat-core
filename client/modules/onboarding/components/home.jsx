/*eslint-disable no-trailing-spaces */
import React from 'react'
import Radium from 'radium'
import {TextField, SelectField, MenuItem, FlatButton} from '/client/lib/ui'
import {color} from '/client/config/theme'
import style from './style'
import Layout from './layout'

class Home extends React.Component {
  render () {
    return (
      <Layout.Window>
        <Layout.Sidebar>
          <header style={style.sidebarHeader}>
            <a style={style.login} href='/login'>Log in</a>
          </header>
          <div style={style.sidebarInner}>
            <h1 style={style.h1}>Princeton.Chat</h1>
            <p>is a private community that connects Princetonians based on shared interests and common needs.</p>
            <form style={style.verifyForm}>
              <div style={style.emailContainer}>
                <TextField hintText='netid' />
                <span>@</span>
                <SelectField value='alumni.princeton.edu'>
                  <MenuItem value='alumni.princeton.edu' primaryText='alumni.princeton.edu' />
                  <MenuItem value='princeton.edu' primaryText='princeton.edu' />
                </SelectField>
              </div>
              <a style={style.manualInvite} href='/o/request-invite' tooltip='No worries. We can verify you manually.'>
                Don't have access to your Princeton email?
              </a>
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
}
export default Radium(Home)
