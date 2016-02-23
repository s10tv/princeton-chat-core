import React from 'react'
import Radium, {StyleRoot} from 'radium'
import Layout from './layout'
import style from '../configs/style'
import {i18n} from '/client/configs/env'
import {FlatButton} from '/client/lib/ui.jsx'
import {color} from '/client/configs/theme'
import { Logo } from './branding.jsx'

const ForgotPasswordSuccess = (props) => {
  return (
    <StyleRoot>
      <Layout.Window>
        <Layout.Sidebar>
          <header style={style.sidebarHeader}>
            <Logo />
          </header>
          <div style={style.sidebarInner}>
            <h1 style={style.h1}>Success!</h1>
            <p>You have successfully reseted your password. Use the new fresh one to log in to Pedplay.</p>
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
