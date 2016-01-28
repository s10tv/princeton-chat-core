import React from 'react';
import FlatButton from 'material-ui/lib/flat-button';
import styles from './styles.js';
import _ from 'underscore';
import {TopicGridContainer} from '../../containers/topic.list.js';
import TextField from 'material-ui/lib/text-field'
import {SquareAvatar} from '../helpers.jsx'

// Type 'welcome'
const primaryButton = ({ onClick }) => {
  return <FlatButton label="Yes" style={styles.primaryButton} rippleColor='white' onClick={onClick} />
}

const secondaryButton = ({ onClick }) => {
  return <FlatButton style={styles.secondaryButton} label="Not Now" rippleColor='white' onClick={onClick} />
}

const welcome = ({user, clickStartOnboarding, clickAbandonOnboarding}) => {
  return {
    comment: (
      <span>
        Hurrah { user.firstName } { user.lastName} from the great class of { user.classYear },
        I’m Tigercub and I’ll setup a few pieces of details to make it
        easier for you and other Princeton alums.
      </span>
    )
  }
};

// Type 'topics'

const topics = ({user, topics}) => {
  return {
    comment: <TopicGridContainer style={{
      marginTop: 16,
    }} />
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
        That's it. If you have any questions, comments, or concerns, utter them or forever remain silent.
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

const linkService = ({clickFacebook, addPassword}) => {
  return {
    comment:
      <span>
        One last thing. How would you like to login to Princeton.chat in the future? You can
      </span>,
    action: (
      <div>
        <div style={{ display: 'inline-block' }}>
          <TextField type="password" floatingLabelText='Choose Password' onEnterKeyDown={addPassword} />
        </div>
        <div style={{ display: 'inline-block', padding: "0px 32px" }}>
          OR
        </div>
        <div style={{ display: 'inline-block' }}>
          <FlatButton
            label="Link Facebook"
            style={styles.facebookButton}
            rippleColor='white'
            onClick={clickFacebook} />
        </div>
      </div>
    )
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

export { welcome, firstName, lastName, topics, classYear, classType, thanks, linkService, share, raw };
