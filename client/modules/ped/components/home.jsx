/*eslint-disable no-trailing-spaces */
import React, {PropTypes} from 'react'
import Radium from 'radium'
import {TextField, SelectField, MenuItem, OrDivider, FlatButton, LinearProgress} from '/client/lib/ui.jsx'
import {color, spacing, fontSize} from '/client/configs/theme'
import style from '../configs/style'
import Layout from './layout'
import TopicList from '/client/modules/core/containers/topic.list.js'
import AddTopicModal from '/client/modules/core/containers/modal.add.topic.js'

const Home = (props) => {
  const {fields: {email, password}, handleSubmit, error, submitting} = props
  const {loginWithFacebook} = props
  return (
    <Layout.Window>
      <Layout.Sidebar>
        <header style={style.sidebarHeader}>
          <a style={style.sidebarLink} href='/request-invite'>Sign up</a>
        </header>
        <div style={style.sidebarInner}>
          <h1 style={s.mainLogo}>Pedagogy and Play</h1>
          <p style={Object.assign(style.brandFont, { marginBottom: 50})}>
            Meet new colleagues in the area, share pedagogy successes (and frustrations), sight-read duets, or perform any repertoire you are working on!
          </p>
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
        <TopicList isLoggedIn={false} />
      </Layout.Main>
      <AddTopicModal />
    </Layout.Window>
  )
}

// TODO: Specify the shape of a field
Home.propTypes = {
  fields: PropTypes.shape({
    email: PropTypes.object.isRequired,
    password: PropTypes.object.isRequired
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string
}

const s = {
  mainLogo: {
    fontWeight: 'normal',
    marginBottom: spacing.x2,
    fontFamily: "'Quicksand', sans-serif",
    color: color.ped.lightPrimary
  },
  emailContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  netid: {
    width: 150,
  },
  atSymbol: {
    marginRight: 4,
  },
  manualInvite: {
    color: color.white,
    fontSize: fontSize.xs,
  },
}

export default Radium(Home)