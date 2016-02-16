/*eslint-disable no-trailing-spaces */
import React, { PropTypes } from 'react'
import Radium from 'radium'
import {propTypes as reduxFormPropTypes} from 'redux-form'
import {TextField, SelectField, MenuItem, FlatButton, LinearProgress} from '/client/lib/ui.jsx'
import {color} from '/client/configs/theme'
import {fieldShape} from '/client/lib/shapes'
import {i18n} from '/client/configs/env'
import Layout from './layout'
import style from '../configs/style'

class RequestInvite extends React.Component {

  render () {
    const {fields: {
      firstName, lastName, birthDate, classYear, degree, email
    }, submitting, error, handleSubmit} = this.props
    const {isMobile, degrees} = this.props
    return (
      <Layout.Window style={[isMobile && s.mobileWindow]}>
        <Layout.Sidebar>
          <header style={style.sidebarHeader}>
            <span style={style.sidebarLogo}>Princeton.Chat</span>
            <a style={style.sidebarLink} href='/'>Back</a>
          </header>
          <div style={[style.sidebarInner, isMobile && s.mobileSidebarInner]}>
            <h2>Verify Affiliation</h2>
            <p>
              Please verify your affiliation to Princeton by providing your name,
              date of birth, Princeton degree and class year.
            </p>
            <form style={style.form} onSubmit={handleSubmit}>
              <div style={s.nameRow}>
                <TextField floatingLabelText='First Name' {...firstName} />
                <div style={style.horizontalSpacer} />
                <TextField floatingLabelText='Last Name' {...lastName} />
              </div>
              <TextField floatingLabelText='Birth Date' hintText='MM/DD/YYYY'
                fullWidth {...birthDate} />
              <TextField floatingLabelText='Princeton Class Year' hintText='e.g. 2012'
                fullWidth {...classYear} />
              <SelectField maxHeight={300}
                floatingLabelText='Princeton Degree' fullWidth={true} {...degree}>
                <MenuItem value='' primaryText='' />
                {degrees.map(degree => <MenuItem key={degree.value} value={degree.value}
                  primaryText={degree.label} />)}
              </SelectField>
              <TextField floatingLabelText='Personal Email'
                hintText={'Where do we send the invite to?'}
                fullWidth={true}
                {...email} />
              <br />
              {error && <p style={style.error}>{error}</p>}
              <br />
              <FlatButton type='submit' style={style.button} label='Verify' disabled={submitting}
                          backgroundColor={color.green} hoverColor={color.lightGreen} />
              {submitting && <LinearProgress />}
            </form>
          </div>
        </Layout.Sidebar>
        <Layout.Main backgroundUrl={ i18n('homePageBackgroundUrl') } />
      </Layout.Window>
    )
  }
}

RequestInvite.propTypes = {
  ...reduxFormPropTypes,
  fields: PropTypes.shape({
    firstName: fieldShape.isRequired,
    lastName: fieldShape.isRequired,
    birthDate: fieldShape.isRequired,
    classYear: fieldShape.isRequired,
    degree: fieldShape.isRequired
  }).isRequired,
  isMobile: PropTypes.bool.isRequired,
  degrees: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }))
}

const s = {
  nameRow: {
    display: 'flex'
  },

  mobileWindow: {
    height: 'initial',
    overflowY: 'scroll'
  },

  mobileSidebarInner: {
    padding: '16px 16px 25px 16px'
  }
}
export default Radium(RequestInvite)
