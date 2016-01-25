import React from 'react';
import TextField from 'material-ui/lib/text-field';
import Paper from 'material-ui/lib/paper';
import Avatar from 'material-ui/lib/avatar';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import { welcome, firstName, lastName, classYear, classType, thanks, linkService, share, raw } from './tigerBotMessages.jsx';
import styles from './styles';
import moment from 'moment';

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
            <div className="user-name question-title">{ username }</div>
            <div className="question-title">{ comment }</div>
            { action }
          </div>
        </ListItem>
      </List>
    </div>
  )
}

class Onboarding extends React.Component {
  componentWillUpdate() {
    const scrollableDiv = this.refs.scrollableDiv;
    this.shouldScrollBottom = scrollableDiv.scrollTop + scrollableDiv.offsetHeight === scrollableDiv.scrollHeight;
  }

  componentDidUpdate() {
    if (this.shouldScrollBottom) {
      const scrollableDiv = this.refs.scrollableDiv;
      scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
    }
  }

  messageOnType(message) {
    const {clickStartOnboarding, clickAbandonOnboarding, LocalState, user, clickFacebook, clickInstagram, clickSkip} = this.props;
    switch (message.type) {
      case 'welcome':
        LocalState.set('type', undefined);
        return welcome({clickStartOnboarding, clickAbandonOnboarding});
      case 'firstname':
        LocalState.set('type', 'firstname');
        return firstName;
      case 'lastname':
        LocalState.set('type', 'lastname');
        return lastName;
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
        return linkService({ clickFacebook, clickInstagram });
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
    const scrollableDiv = this.refs.scrollableDiv;
    scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
    
    const {submitTextField} = this.props;
    submitTextField(e, this.refs.textField);
  }

  render() {
    const {messages, user} = this.props;
    return (
      <div ref='scrollableDiv' className="content-scrollable">
        <div className="ts-onboarding">
          <div className='princeton-chat-header'>Princeton.Chat</div>
          { messages.map((message) => {
            var msgContent = this.messageOnType(message);
            if (message.senderId == user._id) {
              const lastName = () => {
                if (user.lastName) {
                  return ` ${user.lastName}`;
                } else {
                  return '';
                }
              }
              return baseMessage(msgContent.comment, msgContent.action, user.avatar.url, `${user.firstName}${lastName()}`, message._id);
            } else {
              return tigerBotMessage(msgContent.comment, msgContent.action, message._id);
            }
          }) }

          <form onSubmit={(e) => this.submitTextField(e)}>
            <TextField
              ref='textField'
              style={styles.textField}
              underlineFocusStyle={styles.textFieldUnderlineFocusStyle}
              placeholder='Type message ...'
              />
          </form>
        </div>
      </div>
    )
  }
}

export default Onboarding;
