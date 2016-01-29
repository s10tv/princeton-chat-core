import EditProfileModal from '../components/editprofile.modal.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';
import UserService from '../../../libs/UserService';

export const composer = ({context, actions}, onData) => {
  const { Meteor, FlowRouter, LocalState } = context();

  const resetSessionEditProfile = () => {
    LocalState.set('SETTINGS_EDIT_PROFILE_FIRST_NAME', null);
    LocalState.set('SETTINGS_EDIT_PROFILE_LAST_NAME', null);
    LocalState.set('SETTINGS_EDIT_PROFILE_USERNAME', null);
    LocalState.set('SETTINGS_EDIT_PROFILE_AVATAR', null);
    LocalState.set('SETTINGS_EDIT_PROFILE_CLASS_YEAR', null);
  }

  const handleClose = () => {
    LocalState.set('SETTINGS_EDIT_PROFILE_SHOWING', false);
    resetSessionEditProfile();
  }

  const isOpen = LocalState.get('SETTINGS_EDIT_PROFILE_SHOWING') || false;

  const user = UserService.currentUser();

  const firstName = LocalState.get('SETTINGS_EDIT_PROFILE_FIRST_NAME') || user.firstName;
  const lastName = LocalState.get('SETINGS_EDIT_PROFILE_LAST_NAME') || user.lastName;
  const username = LocalState.get('SETTINGS_EDIT_PROFILE_USERNAME') || user.username;
  const classYear = LocalState.get('SETTINGS_EDIT_PROFILE_CLASS_YEAR') || +user.classYear;

  const firstNameUpdate = (event) => {
    LocalState.set('SETTINGS_EDIT_PROFILE_FIRST_NAME', event.target.value);
  }

  const lastNameUpdate = (event) => {
    LocalState.set('SETTINGS_EDIT_PROFILE_LAST_NAME', event.target.value);
  }

  const usernameUpdate = (event) => {
    LocalState.set('SETTINGS_EDIT_PROFILE_USERNAME', event.target.value);
  }

  const handleClassYearChange = (event, index, value) => {
    LocalState.set('SETTINGS_EDIT_PROFILE_CLASS_YEAR', value);
  }

  const currentAvatarUrl = LocalState.get('SETTINGS_EDIT_PROFILE_AVATAR') || user.avatar.url;

  const changeAvatarToDefault = () => {
    LocalState.set('SETTINGS_EDIT_PROFILE_AVATAR', '/images/princeton.svg');
  }

  const changeAvatarToFacebook = () => {
    if (user.services.facebook) {
      LocalState.set('SETTINGS_EDIT_PROFILE_AVATAR', `https://graph.facebook.com/${user.services.facebook.id}/picture?type=large`);
    } else {
      Meteor.linkWithFacebook({}, (err) => {
        if (err) {
          alert(err.reason);
        } else {
          LocalState.set('SETTINGS_EDIT_PROFILE_AVATAR', `https://graph.facebook.com/${user.services.facebook.id}/picture?type=large`);
        }
      });
    }
  }

  const handleSubmit = () => {
    LocalState.set('SETTINGS_EDIT_PROFILE_SHOWING', false);
    profile = {
      firstName: firstName,
      lastName: lastName,
      username: username,
      classYear: classYear,
      avatarUrl: currentAvatarUrl
    }
    console.log(profile);
    Meteor.call('profile/update', profile, (err) => {
      if (err) {
        alert(err.reason);
      }

      resetSessionEditProfile();
    });
  };

  onData(null, {
    handleClose,
    isOpen,
    handleSubmit,
    firstName,
    lastName,
    username,
    firstNameUpdate,
    lastNameUpdate,
    usernameUpdate,
    classYear,
    handleClassYearChange,
    currentAvatarUrl,
    changeAvatarToFacebook,
    changeAvatarToDefault });
}

export default composeAll(
  composeWithTracker(composer),
  useDeps(),
)(EditProfileModal);
