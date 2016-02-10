import LayoutSidebar from '/imports/modules/core/components/layout/layout.sidebar.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';
import UserService from '/imports/libs/UserService';

export const composer = ({context}, onData) => {
  const {Meteor, Collections, FlowRouter, LocalState} = context();
  if (Meteor.subscribe('topics').ready()) {
    const user = UserService.currentUser();
    if (user) {
      const followedTopics = user ? Collections.Topics.find({
        _id: { $in : user.followingTopics}
      }).fetch() : [];

      const showTopic = function() {
        return FlowRouter.go(`/topics/${this.topic._id}`)
      }

      const navigateTo = function() {
        return FlowRouter.go(`/${this.location}`);
      }

      const showAllTopics = () => {
        return FlowRouter.go('choose-topics');
      }

      const onTapSettings = () => {
        return LocalState.set('SETTINGS_DIALOG_SHOWING', true);
      }

      onData(null, {
        user,
        followedTopics,
        showTopic,
        navigateTo,
        showAllTopics,
        onTapSettings,
        FlowRouter,
        showOverlay: user.status != 'active',
      });
    }
  }
}

const depsMapper = (context, actions) => ({
  showAddPostPopupFn: actions.posts.showAddPostPopup,
  context: () => context
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(LayoutSidebar);
