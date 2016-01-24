import React from 'react';
import FlatButton from 'material-ui/lib/flat-button';
// Type 'welcome'
const primaryButton = ({ onClick, styles }) => {
  return <FlatButton label="Yes" className="primary-button" />
}

const secondaryButton = ({ onClick, styles }) => {
  return <FlatButton className="secondary-button" label="Not Now" />
}

const welcome = {
  comment: <span>Welcome to Princeton.Chat. Are you ready to continue?</span>,
  action: (
    <div className="question-answer">
      { primaryButton({ onClick: () => {} }) }
      { secondaryButton({ onClick: () => {} }) }
    </div>
  )
};

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
  comment: <span>Thanks :) You're all set</span>
}

// Type 'linkservice'

const linkService = {
  comment:
    <span>
      To make it easier for others to recognize you, you can upload a photo.
      Would you like to use the profile pic from your social network?
    </span>,
  action: (
    <div>
      <button>Facebook</button>
      <button>Instagram</button>
      <button>Upload</button>
    </div>
  )
}

// Type 'share'

const share = {
  comment:
    <span>
      Perfect! Can you help us share this?
      <a href='#' id='skip'>Skip</a>
    </span>
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

export { welcome, firstName, lastName, classYear, classType, thanks, linkService, share, raw };
