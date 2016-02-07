import {initContext} from '/imports/configs/context'
import routes from '/imports/configs/routes.jsx'
import actions from '/imports/modules/core/actions/index.js'
import {createApp} from '/imports/libs/mantra'
import injectTapEventPlugin from 'react-tap-event-plugin'

import coreModule from '/imports/modules/core'

const context = initContext()

const app = createApp(context, actions)
app.localize()
app.loadModule(coreModule)
app.loadRoutes(routes)

injectTapEventPlugin()
