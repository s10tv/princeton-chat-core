import Onboarding from '../components/onboarding/index.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';
import UserService from '/imports/libs/UserService';
import DateFormatter from '/imports/libs/DateFormatter';

export const composer = ({context}, onData) => {
  const currentUser = UserService.currentUser();
  if (currentUser && Meteor.subscribe('onboardingMessages').ready()) {
    const {Collections, LocalState} = context();

    const tigerbot = {
      avatar: {
        url: '/images/nph.jpg',
      },
      username: 'tigerbot',
      displayName: 'Tiger Bot'
    };

    const messages = Collections.Messages
      .find({ postId: currentUser.tigerbotPostId })
      .map(message => {
        message.timestamp = DateFormatter.format(message);
        message.owner = (message.senderId == 'system') ? tigerbot : currentUser;
        return message;
      });

    onData(null, {
      post: Posts.findOne(currentUser.tigerbotPostId),
      LocalState,
      showInputBox: currentUser.status == 'active',
      messages,
      user: currentUser,
    });
  }
};

export const depsMapper = (context, actions) => ({
  clickStartOnboarding: actions.onboarding.clickStartOnboarding,
  clickAbandonOnboarding: actions.onboarding.clickAbandonOnboarding,
  submitTextField: actions.onboarding.submitTextField,
  clickFacebook: actions.onboarding.clickFacebook,
  addPassword: actions.onboarding.addPassword,
  clickSkip: actions.onboarding.clickSkip,
  context: () => context
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Onboarding);
