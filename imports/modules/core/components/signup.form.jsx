import React from 'react';
import TextField from 'material-ui/lib/text-field'
import Paper from 'material-ui/lib/paper'
import Avatar from 'material-ui/lib/avatar'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import moment from 'moment'
import {Flex, Block} from 'jsxstyle'
import importedStyles from '/imports/modules/core/components/styles.jsx'
import RaisedButton from 'material-ui/lib/raised-button'
import {Message, MessageGroup} from '/imports/modules/core/components/message.jsx'
import InputBox from '/imports/modules/core/containers/inputBox.js'
import { ScrollingContainer } from '/imports/modules/core/components/helpers.jsx'
import {TopicGridContainer} from '/imports/modules/core/containers/topic.list.js'
import SetPasswordComponentBox from '/imports/modules/core/containers/setPassword.js';

import {i18n} from '/imports/libs/mantra'

const styles = Object.assign(importedStyles, {
  subTitle: {
    textAlign: 'center',
  }
});

const FollowTopicComponent = (props) => {
  return (
    <div className="onboarding-container">
      <div>
        <Block margin={24} color='#F07621' fontWeight='bold' fontSize={30} textAlign='center'>{i18n('title')}</Block>
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
    <div className="onboarding-container">
      <div>
        <Block margin={24} color='#F07621' fontWeight='bold' fontSize={30} textAlign='center'>{i18n('title')}</Block>
        <h1 style={{fontSize: 48, fontWeight: 'normal', textAlign: 'center'}}>
          Welcome Tiger!
        </h1>
        <h2 style={{fontSize: 20, fontWeight: 'normal', textAlign: 'center', padding: '0 16px'}}>
          How would you like to login to {i18n('title')} in the future?
        </h2>
        <p style={styles.subTitle}>
          You can either <b>set a password</b> or <b>link your account</b> with facebook.
        </p>
        <Flex alignItems='center' justifyContent="center">
          <SetPasswordComponentBox style={{ display: 'inline-block' }}  />
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
    proceededToFollowTopics: React.PropTypes.bool.isRequired,
  },

  getPasswordComponent() {
    const {} = this.props;
  },

  getPasswordComponent() {
    const {} = this.props;
  },

  render() {
    return (
      <main style={Object.assign({}, styles.main, { marginLeft: this.props.sidebarOpen ? 240 : 0 })}>
        { this.props.proceededToFollowTopics
          ? <FollowTopicComponent {...this.props} />
          : <SetPasswordComponent {...this.props} />
        }
      </main>
    )
  }
});
