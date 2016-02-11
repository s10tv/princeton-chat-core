import {initContext} from '/imports/configs/context'
import routes from '/imports/configs/routes.jsx'
import actions from '/imports/modules/core/actions/index.js'
import {createApp} from '/client/config/mantra'
import {localize} from '/client/config/env'
import injectTapEventPlugin from 'react-tap-event-plugin'

import coreModule from '/imports/modules/core'

const context = initContext()

const app = createApp(context, actions)
localize()
app.loadModule(coreModule)
app.loadRoutes(routes)

injectTapEventPlugin()
