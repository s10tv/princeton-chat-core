import LogoutModal from '../components-refactor/logout.modal.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';

export const composer = ({context, actions}, onData) => {
  const { Meteor, FlowRouter, LocalState } = context();

  const handleClose = () => {
    LocalState.set('SETTINGS_DIALOG_SHOWING', false);
  }

  const isOpen = LocalState.get('SETTINGS_DIALOG_SHOWING') || false;

  const onLogout = () => {
    LocalState.set('SETTINGS_DIALOG_SHOWING', false); // first close this
    Meteor.logout();
    FlowRouter.go('home');
  }

  onData(null, { onLogout, handleClose, isOpen });
};

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(LogoutModal);
