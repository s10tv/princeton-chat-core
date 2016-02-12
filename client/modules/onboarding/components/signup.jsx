/*eslint-disable no-trailing-spaces */
/*eslint-disable comma-dangle */
import React, {PropTypes} from 'react'
import Radium from 'radium'
import {TextField, SelectField, MenuItem, FlatButton, OrDivider} from '/client/lib/ui.jsx'
import {color, spacing, fontSize} from '/client/config/theme'
import style from './style'
import Layout from './layout'

const Signup = (props) => {
  const {fields: {firstName, lastName, email, password}, handleSubmit, verifiedEmail} = props
  return (
    <Layout.Window>
      <Layout.Sidebar>
        <header style={style.sidebarHeader}>
          <span style={style.logo}>Princeton.Chat</span>
        </header>
        <div style={style.sidebarInner}>
          <h1 style={style.h1}>Welcome Tiger</h1>
          <p>We have successfully verified your affiliation with Princeton.</p>
          <p style={s.verifiedEmail}>{verifiedEmail}</p>
          <p>Let’s get you signed up, this should only take a minute.</p>
          <form style={s.form}>
            <FlatButton icon={<i className='fa fa-facebook' />} label='Continue with Facebook' labelPosition='after'
              style={style.fbButton} backgroundColor={color.facebook.blue} hoverColor={color.facebook.mediumBlue} />
            <OrDivider margin={`${spacing.x3}px ${spacing.x3}px 0 ${spacing.x3}px`} />
            <div style={s.nameRow}>
              <TextField floatingLabelText='First Name' {...firstName} />
              <div style={style.divider} />
              <TextField floatingLabelText='Last Name' {...lastName} />
            </div>
            <TextField floatingLabelText='Primary Email' fullWidth={true} {...email} />
            <TextField floatingLabelText='Password' type='password' fullWidth={true} {...password} />
            <br />
            <FlatButton style={style.submitButton} label='Signup'
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
Signup.propTypes = {
  verifiedEmail: PropTypes.string.isRequired,
  fields: PropTypes.shape({
    firstName: PropTypes.object.isRequired,
    lastName: PropTypes.object.isRequired,
    email: PropTypes.object.isRequired,
    password: PropTypes.object.isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
}
const s = {
  form: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  verifiedEmail: {
    textAlign: 'center',
    marginTop: spacing.x2,
    marginBottom: spacing.x4,
    fontSize: fontSize.lg,
  },
  nameRow: {
    display: 'flex',
  }
}

export default Radium(Signup)
