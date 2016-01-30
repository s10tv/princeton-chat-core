import LogoutModal from '/imports/modules/core/components/modal.logout.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';
import UserService from '../../../libs/UserService';

export const composer = ({context, actions}, onData) => {
  const { Meteor, FlowRouter, LocalState } = context();
  const isOpen = LocalState.get('SETTINGS_DIALOG_SHOWING') || false;

  const user = UserService.currentUser();
  onData(null, { isOpen, user });
};

const depsMapper = (context, actions) => ({
  onLogout: actions.settings.logout,
  handleClose: actions.settings.closeSettingsModal,
  editProfile: actions.settings.editProfile,
  context: () => context
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(LogoutModal);
