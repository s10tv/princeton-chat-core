// gets the current user, with default values filled in.
export default class UserService {

  static getUserView(user) {
    if (!user) {
      user = {};
    }

    user.followingTopics = user.followingTopics || [];
    user.followingPosts = user.followingPosts|| [];
    user.expertTopics = user.expertTopics || [];

    user.status = user.status || 'pending';
    user.avatar = user.avatar || { url: '/images/princeton.svg' };

    if (user.classYear) {
      const shortClassYear = (/^[0-9]{4}$/.test(user.classYear)) ?
        user.classYear.substring(2) :
        user.classYear;

      user.classDisplay = `'${shortClassYear}`;
    } else {
      user.classDisplay= ''
    }

    user.displayUsername = user.username ? `@${user.username}` : '';
    user.displayName = `${user.firstName} ${user.lastName} ${user.classDisplay}`;

    return user;
  }

  static currentUser() {
    const user = Meteor.user();
    if (!user) {
      return null;
    }

    return UserService.getUserView(user);
  }
}
