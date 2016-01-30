import LogoutModal from '/imports/modules/core/components/modal.logout.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';

export const composer = ({context, actions}, onData) => {
  const { Meteor, FlowRouter, LocalState } = context();
  const isOpen = LocalState.get('SETTINGS_DIALOG_SHOWING') || false;
  onData(null, { isOpen });
};

const depsMapper = (context, actions) => ({
  onLogout: actions.settings.logout,
  handleClose: actions.settings.closeSettingsModal,
  context: () => context
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(LogoutModal);
