import React from 'react'
import FlatButton from 'material-ui/lib/flat-button'
import TextField from 'material-ui/lib/text-field'
import _ from 'underscore'
import styles from './styles.js'
import {TopicGridContainer} from '/imports/modules/core/containers/topic.list.js'
import { ScrollingContainer } from '/imports/modules/core/components/helpers.jsx'

// Type 'welcome'
const primaryButton = ({ onClick }) => {
  return <FlatButton label="Yes" style={styles.primaryButton} rippleColor='white' onClick={onClick} />
}

const secondaryButton = ({ onClick }) => {
  return <FlatButton style={styles.secondaryButton} label="Not Now" rippleColor='white' onClick={onClick} />
}

const welcome = ({user, clickStartOnboarding}) => {
  return {
    comment: (
      <div>
        <p>
          Hurrah { user.firstName } { user.lastName} from the great class of { user.classYear },
          I’m Tigerbot and I’ll setup a few pieces of details to make it
          easier for you and other Princeton alums.
        </p>
        <p style={{ paddingTop: 8 }}>
          <FlatButton
            label="Get Started"
            style={styles.primaryButton}
            onTouchTap={clickStartOnboarding} />
        </p>
      </div>
    )
  }
};

// Type 'topics'

const followTopics = ({user, topics}) => {
  return {
    comment: (
      <div>
        <span>
          Princeton.Chat is organized around topics curated by the community. <b>Follow a few topics</b> of interest so we can construct a feed of relevant content.
        </span>
        <TopicGridContainer style={{
          marginTop: 16,
        }} />
      </div>
    )
  }
}

// Type 'firstname'

const firstName = {
  comment: <span>What is your first name?</span>
};

// Type 'lastname'

const lastName = {
  comment: <span>What is your last name?</span>
};

// Type 'classyear'

const classYear = (firstName) => {
  return {
    comment: <span>In which year did you graduate {firstName}?</span>
  }
};

// Type 'classtype'

const classType = {
  comment: <span>And was this <b>undergrad (U)</b> or <b>graduate (G)</b>?</span>
}

// Type 'thanks'

const thanks = {
  comment: (
    <div>
      <p>
        That's it. If you have any questions, comments, or concerns, utter them now or forever remain silent.
      </p>
      <p>
        👻 Just kidding! Actually if you send a message to me in the future I'll forward to the team
        that built me. Play around with <a href="/all-mine">Your Feed</a>, explore
        some <a href="/choose-topics">More Topics</a>, and please do send your feedback so we can improve.
        Talk soon :)
      </p>
    </div>
  )
}

// Type 'linkservice'

const flattenedServices = (services) => {
  const flattenedServices = [];
  if (services) {
    _.each(Meteor.user().services, (service, key) => {
      const s = _.clone(service)
      s.serviceName = key;
      flattenedServices.push(s)
    });
  }
  return flattenedServices;
};

const SetPasswordComponent = React.createClass({

  getInitialState() {
    return {
      passwordText: '',
    }
  },

  handleChange(event) {
    this.setState({passwordText: event.target.value})
  },

  setPassword() {
    const password = this.refs.passwordField.getValue();
    this.props.addPassword(password);
  },

  render() {
    const { addPassword, shouldShowPasswordFields, clickFacebook } = this.props;

    return (
      <div className="choose-password-section">
        <div className="password-chooser">
          <TextField
            ref='passwordField'
            type="password"
            floatingLabelText='Choose Password'
            onChange={this.handleChange}
            disabled={!shouldShowPasswordFields} />

          { this.state.passwordText.length == 0 ? null : (
            <div style={{ display: 'inline-block', paddingLeft: 16 }}>
              <FlatButton
                label="Set Password"
                style={shouldShowPasswordFields ? styles.primaryButton : styles.disabledButton}
                disabled={!shouldShowPasswordFields}
                onClick={this.setPassword} />
            </div>
          )}
        </div>

        { this.state.passwordText.length > 0 ? null : (
          <div className="password-chooser" style={{ padding: "0px 16px"}}>
            OR
          </div>
        )}

        { this.state.passwordText.length > 0 ? null : (
          <div className="password-chooser">
            <FlatButton
              label="Link Facebook"
              style={ shouldShowPasswordFields ? styles.facebookButton : styles.disabledButton }
              rippleColor='white'
              disabled={!shouldShowPasswordFields}
              onClick={clickFacebook} />
          </div>
        )}
      </div>
    )
  }
})

const linkService = (props) => {
  const { shouldShowPasswordFields, clickFacebook, addPassword } = props;
  return {
    comment: (
        <span>
          One last thing. How would you like to login to Princeton.chat in the future? You can either <b>set a password</b> or <b>link your account</b> with facebook.
        </span>
    ),

    action: <SetPasswordComponent style={{ display: 'inline-block'}} {...props} />
  }
};

// Type 'share'

const share = ({ clickSkip }) => {
  return {
    comment:
      <span>
        Perfect! Can you help us share this?
        <a href='#' onClick={clickSkip}>Skip</a>
      </span>
  }
}

// Type 'raw'

const raw = (comment) => {
  return {
    comment:
      <span>
        {comment}
      </span>
  }
}

export { welcome, firstName, lastName, followTopics, classYear, classType, thanks, linkService, share, raw };
