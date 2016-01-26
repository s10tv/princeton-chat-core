import LayoutSidebar from '../components/layout.sidebar.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';
import CurrentUser from '/imports/libs/CurrentUser';

export const composer = ({context}, onData) => {
  const {Meteor, Collections, FlowRouter} = context();
  if (Meteor.subscribe('topics').ready()) {
    const user = CurrentUser.get();
    const followedTopics = user ? Collections.Topics.find({
      _id: { $in : user.followingTopics}
    }).fetch() : [];

    onData(null, {
      user,
      followedTopics,
    });
  }
}

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(LayoutSidebar);
