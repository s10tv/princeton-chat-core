// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  if (Lists.find().count() === 0) {
    var data = [
      {name: "Meteor Principles" },
      {name: "Languages" },
      {name: "Favorite Scientists"}
    ];

    var timestamp = (new Date()).getTime();
    _.each(data, function(list) {
      Lists.insert({
        displayName: list.name,
      });
    });
  }
});
