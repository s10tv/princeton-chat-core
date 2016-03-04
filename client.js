import injectTapEventPlugin from 'react-tap-event-plugin'
import {createApp} from 'mantra-core'
import filepicker from 'filepicker-js'
import WebFontLoader from 'webfontloader'
import {Meteor} from 'meteor/meteor'
import {initContext} from 'client/configs/context'
import {localize} from 'client/configs/env'
import core from 'client/modules/core'
import admin from 'client/modules/admin'
import onboarding from 'client/modules/onboarding'

injectTapEventPlugin()
localize()

const context = initContext({onboarding, core, admin})

const app = createApp(context)
app.loadModule(admin)
app.loadModule(core)
app.loadModule(onboarding)

WebFontLoader.load({
  google: {
    families: [
      'Lato:300,400,700',
      'Quicksand'  // for ped & play home page
    ]
  }
})

filepicker.setKey(Meteor.settings.public.filestackKey)

app.init()
context.FlowRouter.initialize()
