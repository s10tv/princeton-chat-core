/*eslint-disable no-trailing-spaces */
import React, { PropTypes } from 'react'
import Radium from 'radium'
import {TextField, SelectField, MenuItem, FlatButton, AutoComplete} from '/client/lib/ui.jsx'
import {color} from '/client/config/theme'
import style from './style'
import Layout from './layout'
import {degrees, classYears} from '../configs/data'

class RequestInvite extends React.Component {

  render () {
    console.log(this.props)
    const {fields: {firstName, lastName, birthDate, classYear, degree, email}, handleSubmit} = this.props
    return (
      <Layout.Window>
        <Layout.Sidebar>
          <header style={style.sidebarHeader}>
            <span style={style.sidebarLogo}>Princeton.Chat</span>
            <a style={style.sidebarLink} href='/o/'>Back</a>
          </header>
          <div style={style.sidebarInner}>
            <h2>Verify Affiliation</h2>
            <p>
              Please verify your affiliation to Princeton by providing your name,
              date of birth, Princeton degree and class year.
            </p>
            <form style={style.form} onSubmit={handleSubmit}>
              <div style={s.nameRow}>
                <TextField floatingLabelText='First Name' {...firstName} />
                <div style={style.horizontalSpacer} />
                <TextField floatingLabelText='Last Name' {...lastName} />
              </div>
              <TextField floatingLabelText='Birth Date' fullWidth={true} {...birthDate} />
              <TextField floatingLabelText='Princeton Class Year' fullWidth={true} {...classYear} />
              <TextField floatingLabelText='Princeton Degree' fullWidth={true} {...degree} />
              <TextField floatingLabelText='Personal Email'
                hintText={'Where do we send the invite to?'}
                fullWidth={true}
                {...email} />
              <br />
              <FlatButton type='submit' style={style.button} label='Verify'
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

RequestInvite.propTypes = {
  fields: PropTypes.shape({
    firstName: PropTypes.object.isRequired,
    lastName: PropTypes.object.isRequired,
    birthDate: PropTypes.object.isRequired,
    classYear: PropTypes.object.isRequired,
    degree: PropTypes.object.isRequired
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired
}

const s = {
  nameRow: {
    display: 'flex'
  }
}
export default Radium(RequestInvite)
