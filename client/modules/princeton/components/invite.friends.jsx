/*eslint-disable no-trailing-spaces */
import React, { PropTypes } from 'react'
import Radium from 'radium'
import {TextField, FlatButton, FontIcon, IconButton, PageControl, LinearProgress} from '/client/lib/ui.jsx'
import {color, spacing, fontSize} from '/client/configs/theme'
import style from '../configs/style'
import Layout from './layout'
import {i18n} from '/client/configs/env'
// NOTE: addField / removeField provided by redux-form http://erikras.github.io/redux-form/#/examples/deep
class InviteFriends extends React.Component {

  render () {
    const {fields: {invitees}, handleSubmit, error, submitting, skipForNow} = this.props
    return (
      <Layout.Window>
        <Layout.Sidebar>
          <header style={style.sidebarHeader}>
            <span style={style.sidebarLogo}>Princeton.Chat</span>
          </header>
          <div style={style.sidebarInner}>
            <h1 style={style.h1}>Better with friends</h1>
            <p>
              Who were your two best friends from Princeton? Get them to join you on Princeton.Chat.
            </p>
            <form style={style.form} onSubmit={handleSubmit}>
              {invitees.map(({email}, index) =>
                <div key={index} style={s.row}>
                  <TextField floatingLabelText='Email' {...email} style={s.email}/>
                  {invitees.length > 1 ?
                    <IconButton onTouchTap={() => invitees.removeField(index)} tabIndex={-1}>
                      <FontIcon className='material-icons'>close</FontIcon>
                    </IconButton> :
                    <div style={{width: 48}} />
                  }
                </div>
              )}
              <br />
              {error && <p style={style.error}>{error}</p>}
              <a href='#' style={s.addAnother} onClick={() => invitees.addField()}>Add another</a>
              <br />
              <FlatButton type='submit' style={style.button} label='Done' disabled={submitting}
                backgroundColor={color.green} hoverColor={color.lightGreen} />
              {submitting && <LinearProgress color={color.brand.primary} />}
              <a style={s.skip} href='#' onClick={skipForNow} tabIndex={-1}>Or skip for now</a>
              <PageControl total={3} current={2} />
            </form>
          </div>
        </Layout.Sidebar>
        <Layout.Main backgroundUrl={ i18n('homePageBackgroundUrl') }>
        </Layout.Main>
      </Layout.Window>
    )
  }
}
// NOTE: We are not currently using first and last name at the moment
// <div style={style.horizontalSpacer} />
// <TextField floatingLabelText='First Name' hintText='(optional)' {...firstName} />
// <div style={style.horizontalSpacer} />
// <TextField floatingLabelText='Last Name' hintText='(optional)' {...lastName} />
const inviteeShape = PropTypes.shape({
  firstName: PropTypes.object.isRequired,
  lastName: PropTypes.object.isRequired,
  email: PropTypes.object.isRequired
})

InviteFriends.propTypes = {
  fields: PropTypes.shape({
    invitees: PropTypes.arrayOf(inviteeShape).isRequired
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
}

const s = {
  row: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  email: {
    flex: 1,
  },
  addAnother: {
    color: color.white,
    fontSize: fontSize.sm,
  },
  skip: {
    alignSelf: 'flex-end',
    marginTop: spacing.x1,
    color: color.white,
    fontSize: fontSize.xs,
  }
}
export default Radium(InviteFriends)
