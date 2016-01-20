Template.todoItemDetail.events({
  'submit form': function(event) {
    event.preventDefault();
    const commentBox = $(event.target).find('input[name=comment]');
    const postId = this.todo._id;
    const comment = commentBox.val();
    Meteor.call('comment/insert', postId, comment, (err, res) => {
      commentBox.val('');
      $("#post-container").animate({ scrollTop: $("#post-container")[0].scrollHeight}, 1000);

      if (err) {
        console.log('there is an error', err);
        return;
      }
    });
  },

  'click #follow': function(event) {
    event.preventDefault()
    const listId = $(event.target).data('post-id');

    if (listId) {
      Meteor.call('post/follow', listId, (err, res) => {
        if (err) {
          console.log(err);
          return
        }
      })
    }
  },
  'click #unfollow': function(event) {
    event.preventDefault()
    const listId = $(event.target).data('post-id');
    if (listId) {
      Meteor.call('post/unfollow', listId, (err, res) => {
        if (err) {
          console.log(err);
          return
        }
      })
    }
  },
})

Template.todoItemDetail.helpers({
  comments: () => {
    return Comments.find().fetch()
  },
  listName: function() {
    const list = Lists.findOne(this.listId);
    if (list) {
      return list.displayName;
    }
  },
  listId: function() {
    if (this.todo) {
      return this.todo.listId;
    }
  },
  displayTime: function() {
    if (this.todo) {
      return TimeDifferenceCalculator.calculate(new Date(), this.todo.createdAt, true);
    }
  },
  isFollowing: function() {
    var isFollowing = false;
    const user = Meteor.user();
    if (user) {
      if (user.followingPosts) {
        isFollowing = user.followingPosts.indexOf(this.postId) >= 0;
      }
    }

    return isFollowing;
  },

  owner: function() {
    if (this.todo) {
      return Users.findOne({ _id: this.todo.ownerId });
    }
  },

  // with user in scope
  displayName: function() {
    return Users.displayName(this);
  },
  avatarUrl: function() {
    return this.avatar.url;
  }
})
