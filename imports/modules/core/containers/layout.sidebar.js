import LayoutSidebar from '../components/layout.sidebar.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';
import UserService from '/imports/libs/UserService';

export const composer = ({context}, onData) => {
  const {Meteor, Collections, FlowRouter, LocalState} = context();
  if (Meteor.subscribe('topics').ready() && Meteor.subscribe('directMessages').ready()) {
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

      const directMessages = Posts.find({ isDM: true }).map(post => {
        const otherUsers = _.reject(post.followers, (follower) => {
          return follower.userId == Meteor.userId();
        }).map(follower => {
          return Users.findOne(follower.userId);
        }).filter(user => {
          return user != undefined;
        })

        post.displayName = otherUsers.map(otherUser => `@${otherUser.username}`).join(',');
        post.onClick = () => {
          if (post.displayName == '@tigerbot') {
            FlowRouter.go('/welcome')
          } else {
            FlowRouter.go(`/users/${post._id}`)
          }
        }
        return post;
      })

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
        directMessages,
        showAllTopics,
        onTapSettings,
      });
    }
  }
}

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(LayoutSidebar);
