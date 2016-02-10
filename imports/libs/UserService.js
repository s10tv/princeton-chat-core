import { i18n } from '/imports/libs/mantra'

// gets the current user, with default values filled in.
export default class UserService {

  static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static getUserView(user) {
    if (!user) {
      user = {};
    }

    user.followingTopics = user.followingTopics || [];
    user.followingPosts = user.followingPosts|| [];
    user.expertTopics = user.expertTopics || [];

    user.status = user.status || 'pending';
    user.avatar = user.avatar || { url: i18n('defaultAvatar') };

    if (user.classYear) {
      const shortClassYear = (/^[0-9]{4}$/.test(user.classYear)) ?
        user.classYear.substring(2) :
        user.classYear;

      user.classDisplay = `'${shortClassYear}`;
    } else {
      user.classDisplay= ''
    }

    user.displayUsername = user.username ? `@${user.username}` : '';

    // temporary. This will be deprecated as soon as users are able to add their own uernames.
    // do not use unless you're working with the sidebar.
    user.shortDisplayName = "";
    user.displayName = "";
    user.avatarInitials = "";

    if (user.firstName) {
      user.displayName += `${user.firstName} `;
      user.avatarInitials += user.firstName.charAt(0).toLowerCase();
      user.shortDisplayName = UserService.capitalizeFirstLetter(user.firstName);
    }

    if (user.lastName) {
      user.avatarInitials += user.lastName.charAt(0).toLowerCase();
      user.displayName += `${user.lastName} `;
    }

    if (user.classDisplay) {
      user.displayName += `${user.classDisplay} `;
    }

    if (user.emails && user.emails.length > 0) {
      user.displayEmail = user.emails[0].address;

      if (user.shortDisplayName.length == 0) {
        user.shortDisplayName = user.emails[0].address;
      }

      if (user.avatarInitials.length == 0) {
        user.avatarInitials = user.emails[0].address.charAt(0).toLowerCase();
      }
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
