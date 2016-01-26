import UserService from '/imports/libs/UserService';

export default {
  follow({Collections}, postId) {
    const currentUser = UserService.currentUser();
    if (currentUser) {
      Collections.Users.update(currentUser._id, { $addToSet: {
        followingPosts: postId,
      }})
    }
  },
};
