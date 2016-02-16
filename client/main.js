import injectTapEventPlugin from 'react-tap-event-plugin'
import {createApp} from 'mantra-core'
import {initContext} from '/client/configs/context'
import {localize} from '/client/configs/env'
import core from '/client/modules/core'
import admin from '/client/modules/admin'
import WebFontLoader from 'webfontloader'
// onboarding modules
import princeton from '/client/modules/princeton'
import ped from '/client/modules/ped'

injectTapEventPlugin()
localize()

const context = initContext({princeton, core, admin})

const app = createApp(context)
app.loadModule(admin)
app.loadModule(core)

switch (context.audience) {
  case 'ped':
    app.loadModule(ped)
    break
  case 'princeton': // fallthrough intentional. default to princeton
  default:
    app.loadModule(princeton)
}

WebFontLoader.load({
  google: {
    families: [
      'Lato:300,400,700',
      'Quicksand'  // for ped & play home page
    ]
  }
})

app.init()
