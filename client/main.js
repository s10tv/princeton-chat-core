import injectTapEventPlugin from 'react-tap-event-plugin'
import {createApp} from 'mantra-core'
import {initContext} from '/client/config/context'
import {localize} from '/client/config/env'
import coreModule from '/client/modules/core'
import onboardingModule from '/client/modules/onboarding'

injectTapEventPlugin()
localize()

const context = initContext()

const app = createApp(context)
app.loadModule(onboardingModule)
app.loadModule(coreModule)
app.init()
