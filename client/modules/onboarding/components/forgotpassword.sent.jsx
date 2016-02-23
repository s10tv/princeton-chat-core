import React from 'react'
import Layout from './layout'
import style from '../configs/style'
import {FlatButton} from '/client/lib/ui.jsx'
import {color} from '/client/configs/theme'
import Radium, {StyleRoot} from 'radium'
import {i18n} from '/client/configs/env'
import { Logo } from './branding.jsx'

const ForgotPasswordSent = (props) => {
  return (
    <StyleRoot>
      <Layout.Window>
        <Layout.Sidebar>
          <header style={style.sidebarHeader}>
            <Logo />
            <a style={style.sidebarLink} href='/login'>Log in</a>
          </header>
          <div style={style.sidebarInner}>
            <h1 style={style.h1}>Email Sent</h1>
            <p>Check your mail. We sent you a link to recover your password.</p>
            <FlatButton style={style.button} linkButton label='Go Back' href='/login'
              backgroundColor={color.green} hoverColor={color.lightGreen} />
          </div>
        </Layout.Sidebar>
        <Layout.Main backgroundUrl={i18n('homePageBackgroundUrl')} />
      </Layout.Window>
    </StyleRoot>
  )
}

export default Radium(ForgotPasswordSent)
