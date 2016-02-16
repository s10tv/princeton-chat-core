/*eslint-disable no-trailing-spaces */
import React, { PropTypes } from 'react'
import Radium from 'radium'
import {TextField, SelectField, MenuItem, FlatButton, LinearProgress, DatePicker} from '/client/lib/ui.jsx'
import {color} from '/client/configs/theme'
import style from '../configs/style'
import Layout from './layout'
import { Logo } from './ui.jsx'

class RequestInvite extends React.Component {

  render () {
    const {fields: {
      firstName, lastName, email, desc,
      }, submitting, error, handleSubmit} = this.props
    return (
      <Layout.Window>
        <Layout.Sidebar>
          <header style={style.sidebarHeader}>
            <Logo />
            <a style={style.sidebarLink} href='/'>Back</a>
          </header>
          <div style={Object.assign(style.sidebarInner, style.brandFont)}>
            <h2>Verify Affiliation</h2>
            <p>
              Pedagogy and Play is a private community for music teachers.
              Please verify your affiliation below.
            </p>
            <form style={style.form} onSubmit={handleSubmit}>
              <div style={s.nameRow}>
                <TextField floatingLabelText='First Name' {...firstName} />
                <div style={style.horizontalSpacer} />
                <TextField floatingLabelText='Last Name' {...lastName} />
              </div>
              <TextField floatingLabelText='Personal Email'
                         hintText={'Where do we send the invite to?'}
                         fullWidth={true}
                {...email} />
              <TextField floatingLabelText='Professional Affiliations (Optional)'
                         hintText={'Are you affiliated with any organizations? ' +
                         'Please list them here.'}
                         rows={5}
                         multiLine={true}
                         fullWidth={true}
                {...desc} />
              <br />
              {error && <p style={style.error}>{error}</p>}
              <br />
              <FlatButton type='submit' style={style.button} label='Verify' disabled={submitting}
                          backgroundColor={color.green} hoverColor={color.lightGreen} />
              {submitting && <LinearProgress />}
            </form>
          </div>
        </Layout.Sidebar>
        <Layout.Main backgroundUrl='/images/performance.jpg' />
      </Layout.Window>
    )
  }
}

RequestInvite.propTypes = {
  fields: PropTypes.shape({
    firstName: PropTypes.object.isRequired,
    lastName: PropTypes.object.isRequired,
    email: PropTypes.object.isRequired,
    desc: PropTypes.object.isRequired
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired
}

const s = {
  nameRow: {
    display: 'flex'
  }
}
export default Radium(RequestInvite)
