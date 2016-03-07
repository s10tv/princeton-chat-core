import injectTapEventPlugin from 'react-tap-event-plugin'
import {createApp} from 'mantra-core'
import {initContext} from '/client/configs/context'
import {localize} from '/client/configs/env'
import core from '/client/modules/core'
import admin from '/client/modules/admin'
import ama from '/client/modules/ama'
import onboarding from '/client/modules/onboarding'
import WebFontLoader from 'webfontloader'
import filepicker from 'filepicker-js'
import {Meteor} from 'meteor/meteor'
import {injectDeps} from 'react-simple-di'
import {mount} from 'react-mounter'
import AppRouter from './appRouter.jsx'
import React from 'react'

injectTapEventPlugin()
localize()

export const context = initContext({onboarding, core, admin, ama})

const app = createApp(context)
app.loadModule(core)
app.loadModule(admin)
app.loadModule(ama)
app.loadModule(onboarding)

app.init()
mount(() => React.createElement(
  injectDeps(app.context, app.actions)(AppRouter),
  {context}
))

WebFontLoader.load({
  google: {
    families: [
      'Lato:300,400,500,600,700',
      'Quicksand'  // for ped & play home page
    ]
  }
})

filepicker.setKey(Meteor.settings.public.filestackKey)
