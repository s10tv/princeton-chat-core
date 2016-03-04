import React, {PropTypes} from 'react'
import Radium, {StyleRoot} from 'radium'
import {TextField, FlatButton, LinearProgress, PageControl} from 'client/lib/ui.jsx'
import {color} from 'client/configs/theme'
import style from '../configs/style'
import Layout from './layout'
import { UserAvatar } from 'client/modules/core/components/helpers.jsx'
import {Flex} from 'jsxstyle'

const Login = (props) => {
  const {fields: {fullName}, handleSubmit, error, submitting} = props
  const {user, changeAvatarToDefault, handleUpload} = props

  return (
    <StyleRoot>
      <Layout.Window>
        <Layout.Sidebar>
          <header style={style.sidebarHeader}>
            <span style={style.sidebarLogo}>Princeton.Chat</span>
          </header>
          <div style={style.sidebarInner}>
            <h1 style={[style.h1, s.smallerHeading]}>Complete Your Profile</h1>
            <p>How would you like to appear to other tigers?</p>
            <form style={style.form} onSubmit={handleSubmit}>
              <UserAvatar size={110} avatar={user.avatar} avatarInitials={user.avatarInitials}
                style={{alignSelf: 'center'}}/>
              <Flex flexShrink={0} style={s.avatarButtonContainer}>
                <FlatButton label='Use Default'
                  backgroundColor={color.avatarButtons.dullGrey}
                  hoverColor={color.avatarButtons.lighterGrey}
                  style={s.avatarButton}
                  onTouchTap={changeAvatarToDefault}
                  fullWidth />
                <FlatButton label='Upload' primary
                  backgroundColor={color.avatarButtons.dullGrey}
                  hoverColor={color.avatarButtons.lighterGrey}
                  style={s.avatarButton}
                  onTouchTap={handleUpload}
                  fullWidth />
              </Flex>
              <TextField floatingLabelText='Full Name'
                hintText="e.g. Fred Flintstone '61 P12" fullWidth {...fullName} />
              <p style={s.annotation}>
                {"Include your class year and other affiliations in your full name"}
              </p>
              {error && <p style={style.error}>{error}</p>}
              <FlatButton type='submit' style={style.button} label='Next' disabled={submitting}
                backgroundColor={color.green} hoverColor={color.lightGreen} />
              {submitting && <LinearProgress color={color.brand.primary} />}
              <PageControl divStyle={{marginTop: 10, marginBottom: 20}} total={4} current={1} />
            </form>
          </div>
        </Layout.Sidebar>
        <Layout.Main backgroundUrl='/images/bg-nassau-filter.jpg' />
      </Layout.Window>
    </StyleRoot>
  )
}

const s = {
  avatarButtonContainer: {
    marginTop: 10,
    alignSelf: 'center'
  },
  avatarButton: {
    color: 'white',
    marginRight: 15,
    textTransform: 'inherit'
  },
  smallerHeading: {
    fontSize: '1.9rem'
  },
  annotation: {
    fontSize: 12,
    marginTop: 12,
    marginBottom: 0
  }
}

Login.propTypes = {
  fields: PropTypes.shape({
    classYear: PropTypes.object.isRequired,
    fullName: PropTypes.object.isRequired
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string
}

export default Radium(Login)
