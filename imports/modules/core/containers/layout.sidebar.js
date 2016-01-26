import LayoutSidebar from '../components/layout.sidebar.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';
import CurrentUser from '/imports/libs/CurrentUser';

export const composer = ({context}, onData) => {
  const {Meteor, Collections, FlowRouter} = context();
  if (Meteor.subscribe('topics').ready()) {
    const currentUser = CurrentUser.get();
    console.log(currentUser);

    const followedTopics = currentUser ? Collections.Topics.find({
      _id: { $in : currentUser.followingTopics}
    }).fetch() : [];

    onData(null, {
      followedTopics,
      avatar: currentUser.avatar
    });
  }
}

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(LayoutSidebar);
