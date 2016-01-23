import React from 'react';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import Paper from 'material-ui/lib/paper';
import Avatar from 'material-ui/lib/avatar';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

const PRINCETON_ORANGE = '#F07621';
const PRINCETON_WHITE = 'white'
const GREY = '#cccccc';

const primarybutton = ({ onClick, styles }) => {
  return <FlatButton label="Yes"
    style={{
      backgroundColor: PRINCETON_ORANGE,
      color: PRINCETON_WHITE,
      marginRight: 10
    }} />
}

const secondaryButton = ({ onClick, styles }) => {
  return <FlatButton style={{
    backgroundColor: GREY,
    color: PRINCETON_WHITE,
  }} label="Not Now" />
}

const tigerBotMessage = (comment, action) => {
  return (
    <div className="ts-onboarding-question">
      <List>
        <ListItem
          disabled={true}
          leftAvatar={
            <Avatar src="images/nph.jpg" />
          }
          rightAvatar={
            <div className="timestamp">3:55pm</div>
          }
        >
          <div className="question-container">
            <div className="user-name question-title">TigerBot</div>
            <div className="question-title">{ comment }</div>

            { action }
          </div>
        </ListItem>
      </List>
    </div>
  )
};

class Onboarding extends React.Component {

  render() {
    const welcomeMessage = (
      <div className="question-answer">
        { primarybutton({ onClick: () => {}}) }
        { secondaryButton({onClick: () => {}}) }
      </div>
    );

    return (
      <div className="ts-onboarding">
        <div style={{ fontSize: 24, fontWeight: 100 }}>Princeton.Chat</div>

        { tigerBotMessage('Welcome to Princeton.Chat. Are you ready to continue?', welcomeMessage)}

        <div className="ts-onboarding-question">
            <List>
              <ListItem
                disabled={true}
                leftAvatar={
                  <Avatar src="images/qiming.jpg" />
                }
                rightAvatar={
                  <div className="timestamp">3:55pm</div>
                }
              >
                <div className="question-title">
                  Yup, I'm excited about Princeton.Chat!
                </div>
              </ListItem>
            </List>
        </div>

        <div className="ts-onboarding-question">
            <List>
              <ListItem
                disabled={true}
                leftAvatar={
                  <Avatar src="images/nph.jpg" />
                }
                rightAvatar={
                  <div className="timestamp">3:55pm</div>
                }
              >
                <div className="question-title">What is your first name?</div>

                <div className="question-answer">
                  <TextField
                    style={{ width: '100%' }}
                    underlineFocusStyle={{ borderColor: PRINCETON_ORANGE }}/>
                </div>
              </ListItem>
            </List>
        </div>
      </div>
    )
  }
}

export default Onboarding;
