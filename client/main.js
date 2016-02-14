import injectTapEventPlugin from 'react-tap-event-plugin'
import {createApp} from 'mantra-core'
import {initContext} from '/client/configs/context'
import {localize} from '/client/configs/env'
import core from '/client/modules/core'
import onboarding from '/client/modules/onboarding'
import email from '/client/modules/email'

injectTapEventPlugin()
localize()

const context = initContext({onboarding, core, email})

const app = createApp(context)
app.loadModule(email)
app.loadModule(onboarding)
app.loadModule(core)
app.init()
