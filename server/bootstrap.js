// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  if (Lists.find().count() === 0) {
    var languagesData = [
      { displayName: "C++" },
      { displayName: "Swift" },
      { displayName: "OCaml" },
      { displayName: "JavaScript" }
    ];

    var databasesData = [
      { displayName: "SQL" },
      { displayName: "Postgres" },
      { displayName: "Redis" },
      { displayName: "MongoDB" },
      { displayName: "RethinkDB" },
      { displayName: "CouchDB" }
    ];

    var topicHeaders = [
      { displayName: "Databases" },
      { displayName: "Languages" }
    ];

    _.each(topicHeaders, function(topicHeader) {
      TopicHeaders.insert({
        topicHeader: topicHeader.displayName
      });
    });

    _.each(languagesData, function(list) {
      var topicId = Lists.insert({
        displayName: list.displayName,
      });
      TopicHeaders.update({ topicHeader: 'Languages' }, {
        $push: {
          topicIds: topicId
        }
      });
    });

    _.each(databasesData, function(list) {
      var topicId = Lists.insert({
        displayName: list.displayName,
      });
      TopicHeaders.update({ topicHeader: 'Databases' }, {
        $push: {
          topicIds: topicId
        }
      });
    });
  }
});
