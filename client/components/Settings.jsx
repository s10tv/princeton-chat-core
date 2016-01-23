import React from 'react';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';

const PRINCETON_ORANGE = '#F07621';
const PRINCETON_WHITE = 'white';

const Settings = ({currentUser}) => {
  return (
    <div>
      <List>
        <ListItem disabled={true}>
          <div className="question-container">
            <Avatar src={currentUser.avatar.url} style={{ width: 200, height: 200 }}/>
            <div className="user-name question-title">{ `${currentUser.firstName} ${currentUser.lastName}`}</div>
          </div>
        </ListItem>
        <ListItem disabled={true}>
          <a href="#" onClick={() => { Meteor.logout(); window.redirect('/'); return false; }}>Logout</a>
        </ListItem>
      </List>
      <div />
    </div>
  );
}

export default Settings;
