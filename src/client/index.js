import injectTapEventPlugin from 'react-tap-event-plugin'
import {createApp} from 'mantra-core'
import filepicker from 'filepicker-js'
import WebFontLoader from 'webfontloader'
import {Meteor} from 'meteor/meteor'
import outdatedBrowser from 'outdated-browser-rework'
import {initContext} from './configs/context'
import {localize} from './configs/env'
import core from './modules/core'
import admin from './modules/admin'
import onboarding from './modules/onboarding'

injectTapEventPlugin()
localize()
outdatedBrowser()

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
