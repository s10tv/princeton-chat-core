import {initContext} from './configs/context'
import configs from './configs'
import publications from './publications'
import methods from './methods'
import http from './http'
import initDocheadRoutes from './dochead/docheadRoutes.jsx'
import injectDochead from './dochead/injectDochead'

export const context = initContext()
const {Meteor, Migrations} = context

configs(context)
publications(context)
methods(context)
http()
injectDochead(initDocheadRoutes(context))

// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  Migrations.migrateTo('latest')
})
