import React from 'react'
import TextField from 'material-ui/lib/text-field'
import Paper from 'material-ui/lib/paper'
import Avatar from 'material-ui/lib/avatar'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import moment from 'moment'
import {Flex, Block} from 'jsxstyle'
import styles from '/imports/modules/core/components/styles.jsx'
import { welcome, followTopics, thanks, linkService, raw } from './tigerBotMessages.jsx'
import {Message, MessageGroup} from '/imports/modules/core/components/message.jsx'
import InputBox from '/imports/modules/core/containers/inputbox.js'
import { ScrollingContainer } from '/imports/modules/core/components/helpers.jsx'
import { i18n } from '/imports/libs/mantra'

export default React.createClass({
  propTypes: {
    /**
     * Determines whether this is from a direct message (to tiger bot) or onboarding.
     */
    isDirectMessage: React.PropTypes.bool.isRequired,

    /**
     * Determines whether to expand the content to 100% or make room for sidebar.
     */
    sidebarOpen: React.PropTypes.bool.isRequired,

    clickStartOnboarding: React.PropTypes.func.isRequired,
    user: React.PropTypes.object.isRequired,
  },

  messageOnType(message) {
    const { setMessageType } = this.props;

    switch (message.type) {
      case 'welcome':
        setMessageType('type', undefined);
        return welcome(this.props)
      case 'topics':
        setMessageType('type', 'topics');
        return followTopics(this.props);
      case 'linkservice':
        setMessageType('type', undefined);
        return linkService(this.props);
      case 'thanks':
        setMessageType('type', 'thanks');
        return thanks;
      case 'raw':
        if (message.resumeType) {
          setMessageType('type', message.resumeType);
        }
        return raw(message.content);
    }
  },

  submitTextField(e) {
    const {submitTextField} = this.props;
    submitTextField(e, this.refs.textField);
  },

  render() {
    const {messages, user, post, showInputBox, isTyping} = this.props;
    return (
      <main style={Object.assign({}, styles.main, { marginLeft: this.props.sidebarOpen ? 240 : 0 })}>
        <Flex flexDirection='column' flex={1} overflowY='hidden'>
          <Block margin={24} color='#F07621' fontWeight='bold' fontSize={30}>{i18n('title')}</Block>
          <ScrollingContainer alwaysScrollToBottom={true} child={
            <Block flex={1} overflowY='scroll'>
              <h1 style={{fontSize: 48, fontWeight: 'normal', textAlign: 'center'}}>
                { i18n('onboardingGreeting')}
              </h1>
              <h2 style={{fontSize: 20, fontWeight: 'normal', textAlign: 'center', padding: '0 16px'}}>

              </h2>
              { messages.map(message => {

                if (message.isOnboardingMessage) {
                  var msgContent = this.messageOnType(message);

                  return <MessageGroup
                      key={message._id}
                      owner={message.owner}
                      timestamp={message.timestamp}
                      action={msgContent.action}
                      content={msgContent.comment} />
                } else {
                  return <MessageGroup
                      key={message._id}
                      owner={message.owner}
                      timestamp={message.timestamp}
                      content={message.content} />
                }
              })}
            </Block>
          } />

          { !isTyping ? null : <p style={{ padding: "0 20px" }}>Tigerbot is typing ... </p> }
          { !showInputBox ? null :  <InputBox postId={post._id} /> }
        </Flex>
      </main>
    )
  }
})
