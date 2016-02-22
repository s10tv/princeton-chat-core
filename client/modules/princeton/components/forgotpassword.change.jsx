import React from 'react'
import Radium, {StyleRoot} from 'radium'
import Layout from './layout'
import style from '../configs/style'
import {TextField, FlatButton, LinearProgress} from '/client/lib/ui.jsx'
import {color} from '/client/configs/theme'
import {i18n} from '/client/configs/env'

const ForgotPasswordChange = (props) => {
  const { fields: {newPassword, matchNewPassword}, handleSubmit, error, submitting } = props
  return (
    <StyleRoot>
      <Layout.Window>
        <Layout.Sidebar>
          <header style={style.sidebarHeader}>
            <span style={style.sidebarLogo}>Princeton.Chat</span>
          </header>
          <div style={style.sidebarInner}>
            <h1 style={style.h1}>Reset Password</h1>
            <form style={style.form} onSubmit={handleSubmit}>
              <p>Enter your new password below. Make it something personal and memorable, yet hard to guess for others.
              Just between two of us, I like to use the password: '0ra17nge46!'</p>
              <TextField type='password' floatingLabelText='New Password'
                hintText='Type your password here' fullWidth={true} {...newPassword} />
              <TextField type='password' hintText='Type your password here again'
                floatingLabelText='Confirm Password' fullWidth={true} {...matchNewPassword} />
              <br />
              {error && <p style={style.error}>{error}</p>}
              <br />
              <FlatButton type='submit' style={style.button} label='Recover Password'
                disabled={submitting} backgroundColor={color.green} hoverColor={color.lightGreen} />
              {submitting && <LinearProgress color={color.brand.primary} />}
            </form>
          </div>
        </Layout.Sidebar>
        <Layout.Main backgroundUrl={ i18n('homePageBackgroundUrl') } />
      </Layout.Window>
    </StyleRoot>
  )
}

export default Radium(ForgotPasswordChange)
