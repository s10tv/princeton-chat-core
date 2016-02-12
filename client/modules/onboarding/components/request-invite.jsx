/*eslint-disable no-trailing-spaces */
import React from 'react'
import Radium from 'radium'
import {TextField, SelectField, MenuItem, FlatButton, AutoComplete} from '/client/lib/ui.jsx'
import {color} from '/client/config/theme'
import style from './style'
import Layout from './layout'
import {degrees, classYears} from './data'
import {Link} from 'react-router'
import { RouteTransition, presets } from 'react-router-transition'
class RequestInvite extends React.Component {
  render () {
    return (
      <Layout.Window>
        <Layout.Sidebar>
          <header style={style.sidebarHeader}>
            <span style={style.logo}>Princeton.Chat</span>
            <Link style={style.login} to='/o'>Back</Link>

          </header>
          <div style={style.sidebarInner}>
            <h2>Verify Affiliation</h2>
            <p>
              Please verify your affiliation to Princeton by providing your name, 
              date of birth, Princeton degree and class year.
            </p>
            <form style={s.form}>
              <div style={s.nameRow}>
                <TextField floatingLabelText='First Name' />
                <div style={style.divider} />
                <TextField floatingLabelText='Last Name' />
              </div>
              <TextField floatingLabelText='Birth Date' fullWidth={true} />
              <TextField floatingLabelText='Princeton Class Year' fullWidth={true} />
              <TextField floatingLabelText='Princeton Degree' fullWidth={true} />
              <br />
              <FlatButton style={style.submitButton} label='Verify'
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

//<AutoComplete
//  fullWidth={true}
//  floatingLabelText='Princeton Degree'
//  filter={AutoComplete.fuzzyFilter}
//  dataSource={degrees.map(d => d.label)} />
const s = {
  form: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  nameRow: {
    display: 'flex',
  }
}
export default Radium(RequestInvite)
