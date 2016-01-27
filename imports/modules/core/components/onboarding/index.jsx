import React from 'react';
import TextField from 'material-ui/lib/text-field';
import Paper from 'material-ui/lib/paper';
import Avatar from 'material-ui/lib/avatar';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import { welcome, topics, thanks, linkService, raw } from './tigerBotMessages.jsx';
import styles from './styles';
import moment from 'moment';
import {Flex, Block} from 'jsxstyle';
import {Message, MessageGroup} from '../message.jsx';
import InputBox from '../../containers/inputBox.js';

class Onboarding extends React.Component {
  messageOnType(message) {
    const {clickStartOnboarding, clickAbandonOnboarding, LocalState, user, clickFacebook, addPassword, clickSkip} = this.props;
    switch (message.type) {
      case 'welcome':
        LocalState.set('type', undefined);
        return welcome({user: this.props.user, clickStartOnboarding, clickAbandonOnboarding});
      case 'topics':
        LocalState.set('type', 'topics');
        return topics({ user: this.props.user, topics: this.props.topics });
      case 'linkservice':
        LocalState.set('type', undefined);
        return linkService({ clickFacebook, addPassword });
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
    const {messages, user, post, showInputBox } = this.props;
    return (
      <Flex flexDirection='column' flex={1}>
        <article className='post-details'>
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
        </article>
        { !showInputBox ? null :  <InputBox postId={post._id} /> }
      </Flex>
    )
  }
}

export default Onboarding;
