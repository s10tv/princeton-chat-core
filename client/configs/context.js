import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import {reducer as formReducer} from 'redux-form'
import createLogger from 'redux-logger'
import invariant from 'invariant'
import sweetalert from 'sweetalert'
import {Meteor} from 'meteor/meteor'
import {FlowRouter} from 'meteor/kadira:flow-router'
import {ReactiveDict} from 'meteor/reactive-dict'
import {Tracker} from 'meteor/tracker'
import {Accounts} from 'meteor/accounts-base'
import Collections from 'lib/collections/index'
import UserService from 'lib/user.service'
import MentionParser from 'lib/mention.parser'

// TODO: Should probably add test for initModules function
// as well as better description & validation of module shape
const createReduxStore = (modules, enableLogger) => {
  invariant(!Array.isArray(modules), 'Modules must be an associative array')

  // See http://erikras.github.io/redux-form/#/api/reducer/normalize
  /* Combineing form configs of the following shape
    formConfig = {
      form: 'home',
      normalize: {
        $key: $normalizer
      },
      ...
    }
  */
  let formNormalizers = {}
  for (const name of Object.keys(modules)) {
    const formConfigs = modules[name].formConfigs || []
    for (let {form: key, normalize: normalize} of formConfigs) {
      invariant(!formNormalizers[key], `form of key '${key}' already exists`)
      if (normalize) {
        formNormalizers[key] = normalize
      }
    }
  }

  // Let each module define its own reducer, we'll then combine them all together
  // for use with redux store
  let reducers = {
    form: formReducer.normalize(formNormalizers)
  }
  for (const name of Object.keys(modules)) {
    invariant(!reducers[name], `Module of name '${name}' already exists`)
    // Atttempt to fix dev server problem
    if (modules[name].reducer) {
      reducers[name] = modules[name].reducer
    }
  }

  const logger = enableLogger ? createLogger() : null
  return createStore(
    combineReducers(reducers),
    compose(
      logger ? applyMiddleware(logger) : (f) => f,
      // Install https://github.com/zalmoxisus/redux-devtools-extension for pure magic!
      typeof window === 'object' && window.devToolsExtension ? window.devToolsExtension() : (f) => f
    )
  )
}

export function initContext (modules = {}) {
  const {settings: {public: settings}} = Meteor
  return {
    Meteor,
    FlowRouter,
    Collections,
    Tracker,
    Accounts,
    sweetalert,
    UserService,
    MentionParser: new MentionParser(Collections),
    currentUser: Meteor.user(),
    LocalState: new ReactiveDict(),
    store: createReduxStore(modules, settings.enableReduxLogger),
    audience: Meteor.settings.public.audience,
    settings
  }
}
