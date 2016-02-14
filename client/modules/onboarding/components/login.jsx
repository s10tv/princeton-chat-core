/*eslint-disable no-trailing-spaces */
/*eslint-disable comma-dangle */
import React, {PropTypes} from 'react'
import Radium from 'radium'
import {TextField, FlatButton, OrDivider, LinearProgress} from '/client/lib/ui.jsx'
import {color, spacing, fontSize} from '/client/configs/theme'
import style from '../configs/style'
import Layout from './layout'

const Login = (props) => {
  const {fields: {email, password}, handleSubmit, error, submitting} = props
  const {loginWithFacebook} = props
  return (
    <Layout.Window>
      <Layout.Sidebar>
        <header style={style.sidebarHeader}>
          <span style={style.sidebarLogo}>Princeton.Chat</span>
          <a style={style.sidebarLink} href='/'>Sign up</a>
        </header>
        <div style={style.sidebarInner}>
          <h1 style={style.h1}>Welcome Back Tiger</h1>
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
            {error && <p style={style.error}>{error}</p>}
            <br />
            <FlatButton type='submit' style={style.button} label='Login' disabled={submitting}
                        backgroundColor={color.green} hoverColor={color.lightGreen} />
            {submitting && <LinearProgress color={color.brand.primary} />}
          </form>
        </div>
      </Layout.Sidebar>
      <Layout.Main>
      </Layout.Main>
    </Layout.Window>
  )
}

Login.propTypes = {
  fields: PropTypes.shape({
    email: PropTypes.object.isRequired,
    password: PropTypes.object.isRequired
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  loginWithFacebook: PropTypes.func.isRequired
}

export default Radium(Login)
