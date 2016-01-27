import React from 'react';
import TextField from 'material-ui/lib/text-field';
import Paper from 'material-ui/lib/paper';
import Avatar from 'material-ui/lib/avatar';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import { welcome, firstName, lastName, topics, classYear, classType, thanks, linkService, share, raw } from './tigerBotMessages.jsx';
import styles from './styles';
import moment from 'moment';
import {Flex, Block} from 'jsxstyle';
import {Message, MessageGroup} from '../message.jsx';
import InputBox from '../../containers/inputBox.js';


const tigerBotMessage = (comment, action, id, date) => {
  return baseMessage(comment, action, '/images/nph.jpg', 'TigerBot', id, date);
};

const baseMessage = (comment, action, avatarSrc, username, id, date) => {
  return (
    <div className="ts-onboarding-question" key={id}>
      <List>
        <ListItem
          disabled={true}
          leftAvatar={
            <Avatar src={avatarSrc} style={styles.avatar}/>
          }
          rightAvatar={
            <div className="timestamp">{moment(date).format('HH:mm A')}</div>
          }
        >
          <div className="question-container">
            <div className="question-title">{ comment }</div>
            { action }
          </div>
        </ListItem>
      </List>
    </div>
  )
}

class Onboarding extends React.Component {
  messageOnType(message) {
    const {clickStartOnboarding, clickAbandonOnboarding, LocalState, user, clickFacebook, addPassword, clickSkip} = this.props;
    switch (message.type) {
      case 'welcome':
        LocalState.set('type', undefined);
        return welcome({user: this.props.user, clickStartOnboarding, clickAbandonOnboarding});
      case 'firstname':
        LocalState.set('type', 'firstname');
        return firstName;
      case 'lastname':
        LocalState.set('type', 'lastname');
        return lastName;
      case 'topics':
        LocalState.set('type', 'topics');
        return topics({ user: this.props.user, topics: this.props.topics });
      case 'classyear':
        LocalState.set('type', 'classyear');
        return classYear(user.firstName);
      case 'classtype':
        LocalState.set('type', 'classtype');
        return classType;
      case 'thanks':
        LocalState.set('type', 'thanks');
        return thanks;
      case 'linkservice':
        LocalState.set('type', undefined);
        return linkService({ clickFacebook, addPassword });
      case 'share':
        LocalState.set('type', 'share');
        return share({ clickSkip });
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

            if (message.type) {
              // special onboarding message handling

              if (message.senderId == user._id) {
                return <MessageGroup
                    key={message._id}
                    owner={message.owner}
                    timestamp={message.timestamp}
                    content={message.content} />
              } else {
                var msgContent = this.messageOnType(message);

                return <MessageGroup
                    key={message._id}
                    owner={message.owner}
                    timestamp={message.timestamp}
                    action={msgContent.action}
                    content={msgContent.comment} />
              }
            } else {
              // regular message handling

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
