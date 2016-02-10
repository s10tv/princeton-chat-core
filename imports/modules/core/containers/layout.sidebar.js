import LayoutSidebar from '/imports/modules/core/components/layout/layout.sidebar.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';
import UserService from '/imports/libs/user.service';

export const composer = ({context}, onData) => {
  const {Meteor, Collections, FlowRouter, LocalState} = context();
  if (Meteor.subscribe('topics').ready()) {
    const user = UserService.currentUser();
    if (user) {
      const followedTopics = user ? Collections.Topics.find({
        _id: { $in : user.followingTopics}
      }).fetch() : [];

      const navigateTo = function() {
        return FlowRouter.go(`/${this.location}`);
      }

      onData(null, {
        user,
        followedTopics,
        navigateTo,
        FlowRouter,
        showOverlay: user.status != 'active',
      });
    }
  }
}

const depsMapper = (context, actions) => ({
  showAddPostPopupFn: actions.posts.showAddPostPopup,
  showTopic: actions.topics.navigateToTopic,
  showAllTopics: actions.topics.navigateToTopicList,
  onTapSettings: actions.settings.editProfile,
  context: () => context
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(LayoutSidebar);
