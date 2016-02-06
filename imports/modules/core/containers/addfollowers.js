import AddFollowers from '/imports/modules/core/components/addFollowers.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';
import UserService from '../../../libs/UserService';
import UserInfoService from '/imports/libs/UserInfoService';

export const composer = ({context, actions, topicId}, onData) => {
  const { Meteor, LocalState, Collections } = context();

  if (Meteor.subscribe('topics').ready()) {
    const topic = Collections.Topics.findOne(topicId);

    onData(null, {
      topic
    });
  }
}

const depsMapper = (context, actions) => ({
  validateEmail: UserInfoService.validateEmail,
  validateName: UserInfoService.validateName,
  sendInvitations: actions.topics.addNewUsers,
  showSnackbarWithString: actions.topics.showSnackbarWithString,
  context: () => context
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper),
)(AddFollowers);
