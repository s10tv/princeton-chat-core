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
})
