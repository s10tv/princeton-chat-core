import React from 'react';
import TextField from 'material-ui/lib/text-field'
import Paper from 'material-ui/lib/paper'
import Avatar from 'material-ui/lib/avatar'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import moment from 'moment'
import {Flex, Block} from 'jsxstyle'
import styles from '/imports/modules/core/components/styles.jsx'
import RaisedButton from 'material-ui/lib/raised-button'
import {Message, MessageGroup} from '/imports/modules/core/components/message.jsx'
import InputBox from '/imports/modules/core/containers/inputBox.js'
import { ScrollingContainer } from '/imports/modules/core/components/helpers.jsx'
import {TopicGridContainer} from '/imports/modules/core/containers/topic.list.js'

export default React.createClass({
  propTypes: {
    /**
     * Determines whether to expand the content to 100% or make room for sidebar.
     */
    sidebarOpen: React.PropTypes.bool.isRequired,

    /**
     * True if the user has proceeded past the following topic screen to set password.
     */
    proceededToSetPassword: React.PropTypes.bool.isRequired,

    /**
     * Function to proceed to the password set page
     */
    goToSetPasswordPage: React.PropTypes.func.isRequired,

    /**
     * True if the user has already followed at least one topic
     */
    hasntFollowedAnyTopics: React.PropTypes.bool.isRequired,
  },

  goToSetPasswordPage() {
    // TODO: validation here
    this.props.goToSetPasswordPage();
  },

  render() {
    return (
      <main style={Object.assign({}, styles.main, { marginLeft: this.props.sidebarOpen ? 240 : 0 })}>
        <Flex flexDirection='column' flex={1} overflowY='hidden'>
          <Block margin={24} color='#F07621' fontWeight='bold' fontSize={30}>Princeton.Chat</Block>
          <Block flex={1} overflowY='scroll'>
            <h1 style={{fontSize: 48, fontWeight: 'normal', textAlign: 'center'}}>
              Welcome Tiger!
            </h1>
            <h2 style={{fontSize: 20, fontWeight: 'normal', textAlign: 'center', padding: '0 16px'}}>
              Princeton.Chat is a community for Princeton alums.
            </h2>
            <TopicGridContainer style={{
              marginTop: 16,
            }} />
          </Block>
          <Block margin={24}>
            <RaisedButton
              label='Next'
              disabled={this.props.hasntFollowedAnyTopics}
              primary={true}
              onTouchTap={this.goToSetPasswordPage} />
          </Block>
        </Flex>
      </main>
    )
  }
});
