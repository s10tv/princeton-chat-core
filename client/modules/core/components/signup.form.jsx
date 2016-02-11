import React from 'react'
import { Flex, Block } from 'jsxstyle'
import importedStyles from '/client/modules/core/components/styles.jsx'
import { TopicGridContainer } from '/client/modules/core/containers/topic.list.js'
import SetPasswordComponentBox from '/client/modules/core/containers/set.password.js'
import { i18n } from '/client/config/env'
import styler from 'react-styling'

const theme = i18n('primaryMuiTheme')
const accent1Color = theme.baseTheme.palette.accent1Color

const styles = Object.assign(importedStyles, {
  subTitle: {
    textAlign: 'center'
  }
})

const style = styler`
.container {
  flex: 1;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  justify-content: center;
  display: flex;
  display: -webkit-flex;
  display: -ms-flexbox;
  margin: 0px 16px;
  -webkit-flex-direction: column;
  -webkit-align-items: center;
  -webkit-justify-content: center;
  -webkit-flex: 1;
  margin: "0px 16px 16px 12px";
}
`

const FollowTopicComponent = (props) => {
  return (
    <div className='onboarding-container' style={style.container}>
      <div>
        <Block
          margin={24}
          color={accent1Color}
          fontWeight='bold'
          fontSize={30}
          textAlign='center'>
          {i18n('title')}
        </Block>
        <h2 style={{fontSize: 20, fontWeight: 'normal', textAlign: 'center', padding: '0 16px'}}>
          {i18n('onboardingDesc')}
        </h2>
        <p style={styles.subTitle}>
          Follow some topics to get started.
        </p>
        <TopicGridContainer style={{ marginTop: 16 }} />
      </div>
    </div>
  )
}

const SetPasswordComponent = (props) => {
  return (
    <div className='onboarding-container' style={style.container}>
      <div>
        <Block
          margin={24}
          color={accent1Color}
          fontWeight='bold'
          fontSize={30}
          textAlign='center'>
          {i18n('title')}
        </Block>
        <h1 style={{fontSize: 48, fontWeight: 'normal', textAlign: 'center'}}>
          {i18n('onboardingGreeting')}
        </h1>
        <h2 style={{fontSize: 20, fontWeight: 'normal', textAlign: 'center', padding: '0 16px'}}>
          How would you like to login to {i18n('title')} in the future?
        </h2>
        <p style={styles.subTitle}>
          You can either <b>set a password</b> or <b>link your account</b> with facebook.
        </p>
        <Flex alignItems='center' justifyContent='center'>
          <SetPasswordComponentBox style={{ display: 'inline-block' }} />
        </Flex>
      </div>
    </div>
  )
}

export default React.createClass({
  propTypes: {
    /**
     * Determines whether to expand the content to 100% or make room for sidebar.
     */
    sidebarOpen: React.PropTypes.bool.isRequired,

    /**
     * True if the user has proceeded past the following topic screen to set password.
     */
    proceededToFollowTopics: React.PropTypes.bool.isRequired
  },

  render () {
    return (
      <main style={Object.assign({}, styles.main, { marginLeft: this.props.sidebarOpen ? 240 : 0 })}>
        {this.props.proceededToFollowTopics
           ? <FollowTopicComponent {...this.props} />
           : <SetPasswordComponent {...this.props} />}
      </main>
    )
  }
})
