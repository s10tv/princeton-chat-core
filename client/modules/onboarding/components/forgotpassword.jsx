import React, {PropTypes} from 'react'
import Radium, {StyleRoot} from 'radium'
import Layout from './layout'
import style from '../configs/style'
import {i18n} from '/client/configs/env'
import {TextField, FlatButton, LinearProgress} from '/client/lib/ui.jsx'
import {color} from '/client/configs/theme'

const ForgotPassword = (props) => {
  const { fields: {email}, handleSubmit, error, submitting } = props
  return (
    <StyleRoot>
      <Layout.Window>
        <Layout.Sidebar>
          <header style={style.sidebarHeader}>
            <span style={style.sidebarLogo}>Princeton.Chat</span>
            <a style={style.sidebarLink} href='/login'>Log in</a>
          </header>
          <div style={style.sidebarInner}>
            <h1 style={style.h1}>Forgot Password?</h1>
            <form style={style.form} onSubmit={handleSubmit}>
              <p>To reset your password, enter the email you used to sign up to Princeton.Chat</p>
              <TextField floatingLabelText='Email' fullWidth {...email} />
              <br />
              {error && <p style={style.error}>{error}</p>}
              <br />
              <FlatButton type='submit' style={style.button} label='Recover Password'
                disabled={submitting} backgroundColor={color.green} hoverColor={color.lightGreen} />
              {submitting && <LinearProgress color={color.brand.primary} />}
            </form>
          </div>
        </Layout.Sidebar>
        <Layout.Main backgroundUrl={i18n('homePageBackgroundUrl')} />
      </Layout.Window>
    </StyleRoot>
  )
}

ForgotPassword.propTypes = {
  fields: PropTypes.shape({
    email: PropTypes.object.isRequired
  }),
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string
}

export default Radium(ForgotPassword)
