/*eslint-disable no-trailing-spaces */
import React, {PropTypes} from 'react'
import Radium, {StyleRoot} from 'radium'
import {propTypes as reduxFormPropTypes} from 'redux-form'
import {TextField, SelectField, MenuItem, FlatButton, LinearProgress} from '/client/lib/ui.jsx'
import {color, spacing, fontSize} from '/client/configs/theme'
import {fieldShape} from '/client/lib/shapes'
import style from '../configs/style'
import Layout from './layout'
import TopicList from '/client/modules/core/containers/topic.list'
import AddTopicModal from '/client/modules/core/containers/modal.add.topic'

const Home = (props) => {
  const mainContent = props.mainContent
    ? props.mainContent
    : <TopicList isLoggedIn={false} isTopicClickable />
  const {domains} = props
  const {fields: {netid, domain, classYear}, handleSubmit, error, submitting} = props

  return (
    <StyleRoot>
      <Layout.Window>
        <Layout.Sidebar>
          <header style={style.sidebarHeader}>
            <a style={style.sidebarLink} href='/login'>Log in</a>
          </header>
          <div style={style.sidebarInner}>
            <h1 style={s.mainLogo}>Princeton.Chat</h1>
            <p>is a private community that connects Princetonians based on shared interests and common needs.</p>
            <form style={style.form} onSubmit={handleSubmit}>
              <TextField floatingLabelText='Princeton Class Year' hintText='e.g. 2012' fullWidth {...classYear} />
              <div style={s.emailContainer}>
                <TextField hintText='netid' {...netid} style={s.netid} />
                <span style={s.atSymbol}>@</span>
                <SelectField hintText='domain' {...domain}>
                  {domains.map((d) =>
                    <MenuItem key={d} value={d} primaryText={d} />
                  )}
                </SelectField>
              </div>
              <a style={s.manualInvite} href='/request-invite'>
                Don't have access to your Princeton email?
              </a>
              {error && <p style={style.error}>{error}</p>}
              <FlatButton type='submit' style={style.button} label='Get Invited' disabled={submitting}
                backgroundColor={submitting ? color.gray : color.green} hoverColor={color.lightGreen} />
              {submitting && <LinearProgress color={color.brand.primary} />}
            </form>
          </div>
        </Layout.Sidebar>
        <Layout.Main>
          {mainContent}
        </Layout.Main>
        <AddTopicModal />
      </Layout.Window>
    </StyleRoot>
  )
}

Home.propTypes = {
  ...reduxFormPropTypes,
  fields: PropTypes.shape({
    netid: fieldShape.isRequired,
    domain: fieldShape.isRequired,
    classYear: fieldShape.isRequired
  }).isRequired,
  domains: PropTypes.arrayOf(PropTypes.string).isRequired
}
const s = {
  mainLogo: {
    fontWeight: 'normal',
    marginBottom: spacing.x2,
    color: color.brand.primary
  },
  emailContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  netid: {
    width: 150
  },
  atSymbol: {
    marginRight: 4
  },
  manualInvite: {
    marginTop: 20,
    color: color.white,
    fontSize: fontSize.xs
  }
}
export default Radium(Home)
