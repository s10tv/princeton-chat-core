/*eslint-disable no-trailing-spaces */
import React from 'react'
import Radium, {StyleRoot} from 'radium'
import YouTube from 'react-youtube'
import {SelectField, MenuItem} from '/client/lib/ui.jsx'
import {color, spacing, fontSize} from '/client/configs/theme'
import style from '../configs/style'
import Layout from './layout'
import TopicList from '/client/modules/core/containers/topic.list'
import AddTopicModal from '/client/modules/core/containers/modal.add.topic'
import StudentForm from '/client/modules/onboarding/containers/home.form.student'
import FacultyForm from '/client/modules/onboarding/containers/home.form.faculty'

class Home extends React.Component {
  render () {
    const mainContent = this.props.mainContent
      ? this.props.mainContent
      : <TopicList isLoggedIn={false} isTopicClickable />
    const {affiliationTypes} = this.props

    const currentForm = () => {
      switch (this.props.homeSelector) {
        case 'student':
          return <StudentForm />
        case 'alum':
          return <StudentForm />
        case 'faculty':
          return <FacultyForm />
        default:
          return null
      }
    }

    return (
      <StyleRoot>
        <Layout.Window>
          <Layout.Sidebar>
            <header style={style.sidebarHeader}>
              <a style={style.sidebarLink} href='/login'>Log in</a>
            </header>
            <div style={[style.sidebarInner, {marginTop: spacing.x2}]}>
              <h1 style={s.mainLogo}>Princeton.Chat</h1>
              <p>is a private community that connects Princetonians based on shared interests and common needs.</p>
              <YouTube videoId='OXvWR4uIZC8' opts={opts} />
              <SelectField onChange={this.props.changeSelector} value={this.props.homeSelector}
                floatingLabelText="What's your affiliation with Princeton?" fullWidth>
                {affiliationTypes.map((a) =>
                  <MenuItem key={a.value} value={a.value} primaryText={a.label} />
                )}
              </SelectField>
              {currentForm()}
              <p style={s.disclaimer}>
                Disclaimer: Princeton.Chat is an alumni led effort NOT officially endorsed by Princeton University.
              </p>
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
}

const opts = {
  height: '170',
  width: 'auto',
  playerVars: { // https://developers.google.com/youtube/player_parameters
    autohide: 1
  }
}

Home.propTypes = {
  mainContent: React.PropTypes.node,
  affiliationTypes: React.PropTypes.array.isRequired,
  homeSelector: React.PropTypes.string.isRequired,
  changeSelector: React.PropTypes.func.isRequired
}
const s = {
  mainLogo: {
    fontWeight: 'normal',
    marginBottom: spacing.x1,
    color: color.brand.primary
  },
  emailContainer: {
    marginTop: 5,
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
  },
  disclaimer: {
    fontSize: 8,
    marginTop: 20
  }
}

export default Radium(Home)
