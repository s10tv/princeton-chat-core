import {initContext} from 'server/configs/context'
import configs from 'server/configs'
import publications from 'server/publications'
import methods from 'server/methods'
import http from 'server/http'
const context = initContext()
const {Meteor, Migrations} = context

configs(context)
publications(context)
methods(context)
http()

// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  Migrations.migrateTo('latest')
})
