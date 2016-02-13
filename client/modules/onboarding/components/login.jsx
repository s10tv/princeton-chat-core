/*eslint-disable no-trailing-spaces */
/*eslint-disable comma-dangle */
import React, {PropTypes} from 'react'
import Radium from 'radium'
import {TextField, FlatButton, OrDivider, PageControl} from '/client/lib/ui.jsx'
import {color, spacing, fontSize} from '/client/configs/theme'
import style from './style'
import Layout from './layout'

const Login = (props) => {
  const {fields: {email, password},
    handleSubmit, verifiedEmail, loginWithFacebook} = props
  return (
    <Layout.Window>
      <Layout.Sidebar>
        <header style={style.sidebarHeader}>
          <span style={style.sidebarLogo}>Princeton.Chat</span>
        </header>
        <div style={style.sidebarInner}>
          <h1 style={style.h1}>Welcome Back</h1>
          <form style={style.form} onSubmit={handleSubmit}>
            <FlatButton
              icon={<i className='fa fa-facebook' />}
              label='Login with Facebook'
              labelPosition='after'
              onTouchTap={loginWithFacebook}
              style={style.fbButton}
              backgroundColor={color.facebook.blue}
              hoverColor={color.facebook.mediumBlue} />
            <OrDivider margin={`${spacing.x3}px ${spacing.x3}px 0 ${spacing.x3}px`} />
            <TextField floatingLabelText='Email' fullWidth={true} {...email} />
            <TextField floatingLabelText='Password' type='password' fullWidth={true} {...password} />
            <br />
            <FlatButton type='submit' style={style.button} label='Login'
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
Login.propTypes = {
  fields: PropTypes.shape({
    email: PropTypes.object.isRequired,
    password: PropTypes.object.isRequired
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  loginWithFacebook: PropTypes.func.isRequired
}
const s = {
  verifiedEmail: {
    textAlign: 'center',
    marginTop: spacing.x2,
    marginBottom: spacing.x4,
    fontSize: fontSize.lg
  },
  nameRow: {
    display: 'flex'
  }
}

export default Radium(Login)
