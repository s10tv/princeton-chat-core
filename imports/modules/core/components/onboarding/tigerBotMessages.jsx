import React from 'react';
import FlatButton from 'material-ui/lib/flat-button';
import styles from './styles.js';
import _ from 'underscore';
// Type 'welcome'
const primaryButton = ({ onClick }) => {
  return <FlatButton label="Yes" style={styles.primaryButton} rippleColor='white' onClick={onClick} />
}

const secondaryButton = ({ onClick }) => {
  return <FlatButton style={styles.secondaryButton} label="Not Now" rippleColor='white' onClick={onClick} />
}

const welcome = ({clickStartOnboarding, clickAbandonOnboarding}) => {
  return {
    comment: <span>Welcome to Princeton.Chat. Are you ready to continue?</span>,
    action: (
      <div>
        { primaryButton({ onClick: clickStartOnboarding }) }
        { secondaryButton({ onClick: clickAbandonOnboarding }) }
      </div>
    )
  }
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

const servicePhotoSrc = (service) => {
  switch(service.serviceName) {
    case 'facebook':
      return `https://graph.facebook.com/${service.id}/picture?type=large`;
    case 'instagram':
      return service.profile_picture;
  }
}

const linkService = ({clickFacebook, clickInstagram, services}) => {
  return {
    comment:
      <span>
        To make it easier for others to recognize you, you can upload a photo.
        Would you like to use the profile pic from your social network?
      </span>,
    action: (
      <div>
        <div>
          <FlatButton
            label="Facebook"
            style={styles.facebookButton}
            rippleColor='white'
            onClick={clickFacebook} />
          <FlatButton
            label="Instagram"
            style={styles.instagramButton}
            rippleColor='white'
            onClick={clickInstagram} />
        </div>
        <div>
          { flattenedServices({ services }).map((service) =>
            <img src={servicePhotoSrc(service)} alt='avatar' key={service.id} />
          )}
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

export { welcome, firstName, lastName, classYear, classType, thanks, linkService, share, raw };
