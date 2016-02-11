import injectTapEventPlugin from 'react-tap-event-plugin'
import {createApp} from 'mantra-core'
import {initContext} from '/imports/configs/context'
import {localize} from '/client/config/env'
import coreModule from '/imports/modules/core'

injectTapEventPlugin()
localize()

const context = initContext()

const app = createApp(context)
app.loadModule(coreModule)
app.init()
