import React from 'react'
import Radium, {StyleRoot} from 'radium'
import Layout from './layout'
import style from '../configs/style'
import {i18n} from '/client/configs/env'
import {FlatButton} from '/client/lib/ui.jsx'
import {color} from '/client/configs/theme'
import {navigateViaRouter} from '/client/lib/helpers'

const ForgotPasswordSuccess = (props) => {
  return (
    <StyleRoot>
      <Layout.Window>
        <Layout.Sidebar>
          <header style={style.sidebarHeader}>
            <span style={style.sidebarLogo}>Princeton.Chat</span>
          </header>
          <div style={style.sidebarInner}>
            <h1 style={style.h1}>Success!</h1>
            <p>You have successfully reset your password. Use the new fresh one to log in to Princeton.Chat</p>
            <FlatButton style={style.button} label='Log in'
              backgroundColor={color.green} hoverColor={color.lightGreen}
              linkButton href='/login' onClick={navigateViaRouter} />
          </div>
        </Layout.Sidebar>
        <Layout.Main backgroundUrl={i18n('homePageBackgroundUrl')} />
      </Layout.Window>
    </StyleRoot>
  )
}

export default Radium(ForgotPasswordSuccess)
