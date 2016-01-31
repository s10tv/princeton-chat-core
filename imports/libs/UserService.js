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

    user.displayName = "";
    if (user.firstName) {
      user.displayName += `${user.firstName} `;
    }

    if (user.lastName) {
      user.displayName += `${user.lastName} `;
    }

    if (user.classDisplay) {
      user.displayName += `${user.classDisplay} `;
    }

    if (user.emails && user.emails.length > 0) {
      user.displayEmail = user.emails[0].address;
    } else {
      user.displayEmail = '';
    }

    return user;
  }

  static currentUser() {
    const user = Meteor.user();
    return UserService.getUserView(user);
  }
}
