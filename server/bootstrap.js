if (!Meteor.settings.public) {
  Meteor.settings.public = {}
}

_.extend(Meteor.settings.public, {
  audience: process.env.AUDIENCE || 'princeton',
})

// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  Migrations.migrateTo('latest');
});
