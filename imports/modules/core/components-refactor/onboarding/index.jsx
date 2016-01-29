import React from 'react'
import TextField from 'material-ui/lib/text-field'
import Paper from 'material-ui/lib/paper'
import Avatar from 'material-ui/lib/avatar'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import { welcome, followTopics, thanks, linkService, raw } from './tigerBotMessages.jsx'
import styles from './styles'
import moment from 'moment'
import {Flex, Block} from 'jsxstyle'
import {Message, MessageGroup} from '../message.jsx'
import InputBox from '../../containers/inputBox.js'
import { ScrollingContainer } from '../helpers.jsx'

class Onboarding extends React.Component {
  messageOnType(message) {
    const {
      shouldShowPasswordFields,
      LocalState,
      user,
      clickStartOnboarding,
      tigerBotMessages,
      topics,
      clickFacebook,
      addPassword,
      clickSkip
    } = this.props;
    switch (message.type) {
      case 'welcome':
        LocalState.set('type', undefined);
        return welcome({ user, clickStartOnboarding })
      case 'topics':
        LocalState.set('type', 'topics');
        return followTopics({ user, topics });
      case 'linkservice':
        LocalState.set('type', undefined);
        return linkService({ shouldShowPasswordFields, clickFacebook, addPassword });
      case 'thanks':
        LocalState.set('type', 'thanks');
        return thanks;
      case 'raw':
        if (message.resumeType) {
          LocalState.set('type', message.resumeType);
        }
        return raw(message.content);
    }
  }

  submitTextField(e) {
    const {submitTextField} = this.props;
    submitTextField(e, this.refs.textField);
  }

  render() {
    const {messages, user, post, showInputBox, isTyping} = this.props;
    return (
      <Flex flexDirection='column' flex={1} overflowY='hidden'>
        <Block margin={24} color='#F07621' fontWeight='bold' fontSize={30}>Princeton.Chat</Block>
        <ScrollingContainer alwaysScrollToBottom={true} child={
          <Block flex={1} overflowY='scroll'>
            <h1 style={{fontSize: 48, fontWeight: 'normal', textAlign: 'center'}}>
              Welcome Tiger!
            </h1>
            <h2 style={{fontSize: 20, fontWeight: 'normal', textAlign: 'center', padding: '0 16px'}}>
              Princeton.Chat is a community for Princeton alums.
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
    )
  }
}

export default Onboarding;
