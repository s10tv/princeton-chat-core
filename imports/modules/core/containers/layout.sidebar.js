import LayoutSidebar from '../components/layout.sidebar.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';

export const composer = ({context}, onData) => {
  const {Meteor, Collections, FlowRouter} = context();
  if (Meteor.subscribe('topics').ready()) {
    const currentUser = Meteor.user();
    const followedTopics = currentUser ? Collections.Topics.find({
      _id: { $in : currentUser.followingTopics}
    }).fetch() : [];

    onData(null, { followedTopics });
  }
}

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(LayoutSidebar);
