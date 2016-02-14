/*eslint-disable no-trailing-spaces */
import React, {PropTypes} from 'react'
import Radium from 'radium'
import {TextField, SelectField, MenuItem, FlatButton, LinearProgress} from '/client/lib/ui.jsx'
import {color, spacing, fontSize} from '/client/configs/theme'
import style from '../configs/style'
import Layout from './layout'
import TopicList from '/client/modules/core/containers/topic.list'
import AddTopicModal from '/client/modules/core/containers/modal.add.topic'

const Home = (props) => {
  const {fields: {netid, domain}, handleSubmit, error, submitting} = props
  return (
    <Layout.Window>
      <Layout.Sidebar>
        <header style={style.sidebarHeader}>
          <a style={style.sidebarLink} href='/login'>Log in</a>
        </header>
        <div style={style.sidebarInner}>
          <h1 style={s.mainLogo}>Princeton.Chat</h1>
          <p>is a private community that connects Princetonians based on shared interests and common needs.</p>
          <form style={style.form} onSubmit={handleSubmit}>
            <div style={s.emailContainer}>
              <TextField hintText='netid' {...netid} />
              <span>@</span>
              <SelectField {...domain}>
                <MenuItem value='alumni.princeton.edu' primaryText='alumni.princeton.edu' />
                <MenuItem value='princeton.edu' primaryText='princeton.edu' />
                <MenuItem value='cornell.edu' primaryText='cornell.edu' />
              </SelectField>
            </div>
            <br />
            <a style={s.manualInvite} href='/request-invite'>
              Don't have access to your Princeton email?
            </a>
            <br />
            {error && <p style={style.error}>{error}</p>}
            <br />
            <FlatButton type='submit' style={style.button} label='Get Invited' disabled={submitting}
              backgroundColor={submitting ? color.gray : color.green} hoverColor={color.lightGreen} />
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
// icon={<CircularProgress size={0.4} />} labelPosition='after'
// TODO: Specify the shape of a field
Home.propTypes = {
  fields: PropTypes.shape({
    netid: PropTypes.object.isRequired,
    domain: PropTypes.object.isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
}
const s = {
  mainLogo: {
    fontWeight: 'normal',
    marginBottom: spacing.x2,
    color: color.brand.primary,
  },
  emailContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  manualInvite: {
    color: color.white,
    fontSize: fontSize.xs,
  },
}
export default Radium(Home)
