/*eslint-disable no-trailing-spaces */
import React, {PropTypes} from 'react'
import Radium, {Style} from 'radium'
import {TextField, SelectField, MenuItem, FlatButton} from '/client/lib/ui.jsx'
import {color} from '/client/config/theme'
import style from './style'
import Layout from './layout'

const OrDivider = () => (
  <div className='or-divider'>
    <Style rules={{
        '.or-divider': {
          display: 'flex',
          alignItems: 'center',
        },
        '.or-divider hr': {
          border: 0,
          height: 0,
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
          flex: 1
        },
        '.or-divider span': {
          margin: '0 8px'
        }
      }}/>
    <hr/>
    <span>or</span>
    <hr/>
  </div>
)

const Signup = (props) => {
  const {fields: {firstName, lastName, email, password}, handleSubmit} = props
  return (
    <Layout.Window>
      <Layout.Sidebar>
        <header style={style.sidebarHeader}>
          <span style={style.logo}>Princeton.Chat</span>
        </header>
        <div style={style.sidebarInner}>
          <h1>Welcome Tiger</h1>
          <p>We can't wait to have you onboard.</p>
          <br/>
          <br/>
          <br/>
          
          <div>Signup with Facebook</div>
          <OrDivider />
          <form style={s.form}>
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
  nameRow: {
    display: 'flex',
  }
}

export default Radium(Signup)
