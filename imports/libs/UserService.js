// gets the current user, with default values filled in.
export default class UserService {

  static getUserView(user) {
    if (!user) {
      return null;
    }
    
    user.followingTopics = user.followingTopics || [];
    user.followingPosts = user.followingPosts|| [];
    user.expertTopics = user.expertTopics || [];

    user.status = user.status || 'pending';
    user.avatar = user.avatar || { url: '/images/nph.jpg' };

    user.classTypeSymbol = "'";
    if (user.classType === 'grad') {
      user.classTypeSymbol = "*";
    }

    user.shortClassYear = (/^[0-9]{4}$/.test(user.classYear)) ?
      user.classYear.substring(2) :
      user.classYear;

    user.displayName = `${user.firstName} ${user.lastName} ${user.classTypeSymbol}${user.shortClassYear}`;

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
