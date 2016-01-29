import LogoutModal from '../components/logout.modal.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';
import UserService from '../../../libs/UserService';

export const composer = ({context, actions}, onData) => {
  const { Meteor, FlowRouter, LocalState } = context();

  const handleClose = () => {
    LocalState.set('SETTINGS_DIALOG_SHOWING', false);
  }

  const isOpen = LocalState.get('SETTINGS_DIALOG_SHOWING') || false;

  const onLogout = (event) => {
    event.preventDefault();
    LocalState.set('SETTINGS_DIALOG_SHOWING', false); // first close this
    Meteor.logout();
    FlowRouter.go('home');
  }

  const editProfile = (event) => {
    event.preventDefault();
    LocalState.set('SETTINGS_EDIT_PROFILE_SHOWING', true);
  }

  const user = UserService.currentUser();
  onData(null, { onLogout, handleClose, isOpen, user, editProfile });
};

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(LogoutModal);
