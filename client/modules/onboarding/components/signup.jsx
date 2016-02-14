/*eslint-disable no-trailing-spaces */
/*eslint-disable comma-dangle */
import React, {PropTypes} from 'react'
import Radium from 'radium'
import {TextField, FlatButton, OrDivider, PageControl} from '/client/lib/ui.jsx'
import {color, spacing, fontSize} from '/client/configs/theme'
import style from '../configs/style'
import Layout from './layout'

const Signup = (props) => {
  const {fields: {firstName, lastName, email, password},
    handleSubmit, verifiedEmail, linkFacebook, facebookInfo} = props
  return (
    <Layout.Window>
      <Layout.Sidebar>
        <header style={style.sidebarHeader}>
          <span style={style.sidebarLogo}>Princeton.Chat</span>
        </header>
        <div style={style.sidebarInner}>
          <h1 style={style.h1}>Welcome Tiger</h1>
          <p>We have successfully verified your affiliation with Princeton.</p>
          <p style={s.verifiedEmail}>{verifiedEmail}</p>
          <p>Let’s get you signed up, this should only take a minute.</p>
          <form style={style.form} onSubmit={handleSubmit}>
            {facebookInfo
              ? <FlatButton
                icon={<i className='fa fa-facebook' />}
                label={facebookInfo.name}
                labelPosition='after'
                disabled
                backgroundColor={color.gray}
                hoverColor={color.facebook.mediumBlue} />
              : <FlatButton
                icon={<i className='fa fa-facebook' />}
                label='Continue with Facebook'
                labelPosition='after'
                onTouchTap={linkFacebook}
                style={style.fbButton}
                backgroundColor={color.facebook.blue}
                hoverColor={color.facebook.mediumBlue} />
            }
            <OrDivider margin={`${spacing.x3}px ${spacing.x3}px 0 ${spacing.x3}px`} />
            <div style={s.nameRow}>
              <TextField floatingLabelText='First Name' {...firstName} />
              <div style={style.horizontalSpacer} />
              <TextField floatingLabelText='Last Name' {...lastName} />
            </div>
            <TextField floatingLabelText='Primary Email' fullWidth={true} {...email} />
            <TextField floatingLabelText='Password' type='password' fullWidth={true} {...password} />
            <br />
            <FlatButton type='submit' style={style.button} label='Signup'
                        backgroundColor={color.green} hoverColor={color.lightGreen} />
            <PageControl total={3} current={0} />
          </form>
        </div>
      </Layout.Sidebar>
      <Layout.Main backgroundUrl='/images/bg-nassau-filter.jpg'>
      </Layout.Main>
    </Layout.Window>
  )
}
// TODO: Specify the shape of a field
Signup.propTypes = {
  verifiedEmail: PropTypes.string.isRequired,
  fields: PropTypes.shape({
    firstName: PropTypes.object.isRequired,
    lastName: PropTypes.object.isRequired,
    email: PropTypes.object.isRequired,
    password: PropTypes.object.isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  linkFacebook: PropTypes.func.isRequired,
}
const s = {
  verifiedEmail: {
    textAlign: 'center',
    marginTop: spacing.x2,
    marginBottom: spacing.x4,
    fontSize: fontSize.lg,
  },
  nameRow: {
    display: 'flex',
  }
}

export default Radium(Signup)
