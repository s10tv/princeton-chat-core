import { Meteor } from 'meteor/meteor'
import { Migrations } from 'meteor/percolate:migrations'
import configs from './configs'
import publications from './publications'
import methods from './methods'
import http from './http'

configs()
publications()
methods()
http()

// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  Migrations.migrateTo('latest')
})
