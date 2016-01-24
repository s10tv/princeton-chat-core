import React from 'react';
import TextField from 'material-ui/lib/text-field';
import Paper from 'material-ui/lib/paper';
import Avatar from 'material-ui/lib/avatar';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import { welcome, firstName, lastName, classYear, classType, thanks, linkService, share, raw } from './tigerBotMessages.jsx';

const tigerBotMessage = (comment, action, id) => {
  return baseMessage(comment, action, '/images/nph.jpg', 'TigerBot', id);
};

const baseMessage = (comment, action, avatarSrc, username, id) => {
  return (
    <div className="ts-onboarding-question" key={id}>
      <List>
        <ListItem
          disabled={true}
          leftAvatar={
            <Avatar src={avatarSrc} />
          }
          rightAvatar={
            <div className="timestamp">3:55pm</div>
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

const messageOnType = (type) => {
  switch (type) {
    case 'welcome':
      return welcome;
    case 'firstname':
      return firstName;
    case 'lastName':
      return lastName;
    case 'classyear':
      return classYear;
    case 'classtype':
      return classType;
    case 'thanks':
      return thanks;
    case 'linkservice':
      return linkService;
    case 'share':
      return share;
    case 'raw':
      return raw;
  }
}

const Onboarding = ({ messages, user }) => {
  return (
    <div className="ts-onboarding">
      <div className='princeton-chat-header'>Princeton.Chat</div>
      { messages.map((message) => {
        var msgContent = messageOnType(message.type);
        if (message.senderId == user._id) {
          return baseMessage(msgContent.comment, msgContent.action, user.avatar.url, `${user.firstName} ${user.lastName}`, message._id);
        } else {
          return tigerBotMessage(msgContent.comment, msgContent.action, message._id);
        }
      }) }
    </div>
  )
}

export default Onboarding;
