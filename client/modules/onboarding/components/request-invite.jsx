/*eslint-disable no-trailing-spaces */
import React from 'react'
import Radium from 'radium'
import {TextField, SelectField, MenuItem, FlatButton} from '/client/lib/ui'
import {color} from '/client/config/theme'
import style from './style'
import Layout from './layout'

class RequestInvite extends React.Component {
  render () {
    return (
      <Layout.Window>
        <Layout.Sidebar>
          <header style={style.sidebarHeader}>
            <span style={style.logo}>Princeton.Chat</span>
            <a style={style.login} href='/o/'>Back</a>
          </header>
          <div style={style.sidebarInner}>
            <h2>Verify Affiliation</h2>
            <p>
              Please verify your affiliation to Princeton by providing your name, 
              date of birth, Princeton degree and class year.
            </p>
            <form style={style.verifyForm}>
              <div style={{display: 'flex'}}>
                <TextField floatingLabelText='First Name' />
                <TextField floatingLabelText='Last Name' />
              </div>
              <TextField floatingLabelText='Birth Date' />
              <TextField floatingLabelText='Princeton Class Year' />
              <TextField floatingLabelText='Princeton Degree' />
              <br />
              <FlatButton style={style.submitButton} label='Submit' 
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
export default Radium(RequestInvite)
