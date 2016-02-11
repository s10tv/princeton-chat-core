import { Meteor } from 'meteor/meteor'
import { Migrations } from 'meteor/percolate:migrations'
import { _ } from 'meteor/underscore'

if (!Meteor.settings.public) {
  Meteor.settings.public = {}
}

_.extend(Meteor.settings.public, {
  audience: process.env.AUDIENCE || 'princeton',
  unsplashKey: process.env.UNSPLASH_KEY || '3b28c5415d07e18260e66e9d5bc3f2434c2aa64bed071d52e8c62c3da800612e'
})

// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  Migrations.migrateTo('latest')
})
