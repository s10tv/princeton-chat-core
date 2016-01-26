import LayoutSidebar from '../components/layout.sidebar.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';
import UserService from '/imports/libs/UserService';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

export const composer = ({context}, onData) => {
  const {Meteor, Collections, FlowRouter} = context();
  if (Meteor.subscribe('topics').ready()) {
    const user = UserService.currentUser();
    const followedTopics = user ? Collections.Topics.find({
      _id: { $in : user.followingTopics}
    }).fetch() : [];

    const showTopic = function() {
      return FlowRouter.go(`/topics/${this.topic._id}`)
    }

    const navigateTo = function() {
      return FlowRouter.go(`/${this.location}`);
    }

    onData(null, {
      user,
      followedTopics,
      showTopic,
      navigateTo,
    });
  }
}

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(LayoutSidebar);
