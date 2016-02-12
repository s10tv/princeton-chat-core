import injectTapEventPlugin from 'react-tap-event-plugin'
import {createApp} from 'mantra-core'
import {initContext} from '/client/config/context'
import {localize} from '/client/config/env'
import core from '/client/modules/core'
import onboarding from '/client/modules/onboarding'

injectTapEventPlugin()
localize()

const context = initContext({onboarding, core})

const app = createApp(context)
app.loadModule(onboarding)
app.loadModule(core)
app.init()
