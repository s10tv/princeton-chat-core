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
    const listId = $(event.target).data('topic-id');
    Meteor.call('topic/follow', listId, (err, res) => {
      if (err) {
        console.log(err);
        return
      }
    })
  },
  'click #unfollow': function(event) {
    event.preventDefault()
    const listId = $(event.target).data('topic-id');
    Meteor.call('topic/unfollow', listId, (err, res) => {
      if (err) {
        console.log(err);
        return
      }
    })
  },
})

Template.todoItemDetail.helpers({
  comments: () => {
    return Comments.find().fetch()
  },
  listName: function() {
    const splitted = window.location.href.split('/');
    const listId = splitted[splitted.length - 2];
    const list = Lists.findOne(listId);
    if (list) {
      return list.name;
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
      if (user.followingTopics) {
        isFollowing = user.followingTopics.indexOf(this.listId) >= 0;
      }
    }

    return isFollowing;
  },

  owner: function() {
    console.log(this);
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
