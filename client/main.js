import injectTapEventPlugin from 'react-tap-event-plugin'
import {createApp} from 'mantra-core'
import {initContext} from '/client/configs/context'
import {localize} from '/client/configs/env'
import core from '/client/modules/core'
import admin from '/client/modules/admin'
import WebFontLoader from 'webfontloader'
import onboarding from '/client/modules/onboarding'
import filepicker from 'filepicker-js'
import {Meteor} from 'meteor/meteor'

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
