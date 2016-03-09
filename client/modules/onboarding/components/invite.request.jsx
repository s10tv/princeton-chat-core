/*eslint-disable no-trailing-spaces */
import React, { PropTypes } from 'react'
import {propTypes as reduxFormPropTypes} from 'redux-form'
import Radium, {StyleRoot} from 'radium'
import {TextField, SelectField, MenuItem, FlatButton, LinearProgress} from '/client/lib/ui.jsx'
import {color} from '/client/configs/theme'
import {fieldShape} from '/client/lib/shapes'
import {i18n} from '/client/configs/env'
import Layout from './layout'
import style from '../configs/style'
import {Link} from 'react-router'

class RequestInvite extends React.Component {
  render () {
    const {fields: {
      firstName, lastName, birthDate, classYear, degree, email
    }, submitting, error, handleSubmit, degrees, classYears} = this.props
    return (
      <StyleRoot>
        <Layout.Window>
          <Layout.Sidebar>
            <header style={style.sidebarHeader}>
              <span style={style.sidebarLogo}>Princeton.Chat</span>
              <Link style={style.sidebarLink} to='/'>Back</Link>
            </header>
            <div style={style.sidebarInner}>
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
                <SelectField maxHeight={300}
                  floatingLabelText='Princeton Class Year' fullWidth {...classYear}>
                  <MenuItem key='default' value='' primaryText=''/>
                  {classYears.map((year) => <MenuItem key={year} value={year} primaryText={year} />)}
                </SelectField>
                <SelectField maxHeight={300}
                  floatingLabelText='Princeton Degree' fullWidth {...degree}>
                  <MenuItem key='default' value='' primaryText='' />
                  {degrees.map((degree) => <MenuItem key={degree.value} value={degree.value}
                    primaryText={degree.label} />)}
                </SelectField>
                <TextField floatingLabelText='Personal Email'
                  hintText={'Where do we send the invite to?'}
                  fullWidth
                  {...email} />
                {error && <p style={style.error}>{error}</p>}
                <FlatButton type='submit' style={Object.assign({}, style.button, {marginBottom: 20})} label='Verify' disabled={submitting}
                  backgroundColor={color.green} hoverColor={color.lightGreen} />
                {submitting && <LinearProgress />}
              </form>
            </div>
          </Layout.Sidebar>
          <Layout.Main backgroundUrl={i18n('homePageBackgroundUrl')} />
        </Layout.Window>
      </StyleRoot>
    )
  }
}

RequestInvite.propTypes = Object.assign({}, reduxFormPropTypes, {
  fields: PropTypes.shape({
    firstName: fieldShape.isRequired,
    lastName: fieldShape.isRequired,
    birthDate: fieldShape.isRequired,
    classYear: fieldShape.isRequired,
    degree: fieldShape.isRequired
  }).isRequired,
  degrees: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })),
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object,
  submitting: PropTypes.bool.isRequired,
  classYears: PropTypes.array.isRequired
})

const s = {
  nameRow: {
    display: 'flex'
  }
}

export default Radium(RequestInvite)
