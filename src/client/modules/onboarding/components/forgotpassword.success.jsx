import React from 'react'
import Radium, {StyleRoot} from 'radium'
import Layout from './layout'
import style from '../configs/style'
import {i18n} from '/src/client/configs/env'
import {FlatButton} from '/src/client/lib/ui.jsx'
import {color} from '/src/client/configs/theme'

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
            <FlatButton style={style.button} linkButton label='Log in' href='/login'
              backgroundColor={color.green} hoverColor={color.lightGreen} />
          </div>
        </Layout.Sidebar>
        <Layout.Main backgroundUrl={i18n('homePageBackgroundUrl')} />
      </Layout.Window>
    </StyleRoot>
  )
}

export default Radium(ForgotPasswordSuccess)
