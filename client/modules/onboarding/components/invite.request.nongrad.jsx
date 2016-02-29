import React from 'react'
import Radium, {StyleRoot} from 'radium'
import Layout from './layout'
import style from '../configs/style'
import {i18n} from '/client/configs/env'
import {TextField, FlatButton, LinearProgress} from '/client/lib/ui.jsx'
import color from '/client/configs/color'
import {Flex} from 'jsxstyle'

const RequestNongradInvite = (props) => {
  const {fields: {firstName, lastName, email, desc}, submitting, error,
  handleSubmit} = props
  return (
    <StyleRoot>
      <Layout.Window>
        <Layout.Sidebar>
          <header style={style.sidebarHeader}>
            <span style={style.sidebarLogo}>Princeton.Chat</span>
            <a style={style.sidebarLink} href='/'>Back</a>
          </header>
          <div style={style.sidebarInner}>
            <h2>Not a Princeton graduate?</h2>
            <p>Please tell more about you and how are you related to Princeton.</p>
            <form style={style.form} onSubmit={handleSubmit}>
              <Flex>
                <TextField floatingLabelText='First Name' {...firstName} />
                <div style={style.horizontalSpacer} />
                <TextField floatingLabelText='Last Name' {...lastName} />
              </Flex>
              <TextField floatingLabelText='Personal Email'
                hintText='Where do we send the invite to?'
                fullWidth
                {...email} />
              <TextField hintText='How are you related to Princeton?'
                fullWidth rows={5} multiLine rowsMax={9} {...desc}/>
              {error && <p style={style.error}>{error}</p>}
              <FlatButton
                type='submit'
                style={Object.assign({}, style.button, {marginBottom: 20})}
                label='Verify' disabled={submitting}
                backgroundColor={color.green}
                hoverColor={color.lightGreen} />
              {submitting && <LinearProgress />}
            </form>
          </div>
        </Layout.Sidebar>
        <Layout.Main backgroundUrl={i18n('homePageBackgroundUrl')}/>
      </Layout.Window>
    </StyleRoot>
  )
}

export default Radium(RequestNongradInvite)
