import AddNewUsersModal from '../components/addnewusers.modal.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';
import UserService from '../../../libs/UserService';

export const composer = ({context, actions}, onData) => {
  const { Meteor, LocalState } = context();

  const isOpen = LocalState.get('SHOW_ADD_NEW_USERS') != undefined;
  const topicId = LocalState.get('SHOW_ADD_NEW_USERS');

  const isAddNewUsersSuccess = LocalState.get('SHOW_ADD_NEW_USERS_SNACKBAR') || false;

  onData(null, {
    isOpen,
    topicId,
    isAddNewUsersSuccess
    });
}

const depsMapper = (context, actions) => ({
  handleClose: actions.topics.closeAddNewUsersModal,
  sendInvitations: actions.topics.addNewUsers,
  closeAddNewUsersSnackbar: actions.topics.closeAddNewUsersSnackbar,
  context: () => context
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper),
)(AddNewUsersModal);
