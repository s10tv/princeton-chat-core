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
      return TimeDifferenceCalculator.calculate(new Date(), this.todo.createdAt) + ' ago';
    }
  },
  owner: function() {
    if (this.todo) {
      return Users.findOne({ _id: this.todo.ownerId });
    }
  },

  // with user in scope
  displayName: function() {
    return Users.displayName(this);
  }
})
