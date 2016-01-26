// gets the current user, with default values filled in.
export default class CurrentUser {
  static get() {
    const user = Meteor.user();
    if (!user) {
      return null;
    }

    user.followingTopics = user.followingTopics || [];
    user.followingPosts = user.followingPosts|| [];
    user.expertTopics = user.expertTopics || [];

    user.status = user.status || 'pending';
    user.avatar = user.avatar || { url: '/images/nph.jpg' };

    return user;
  }
}
