import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import {routerMiddleware, routerReducer, syncHistoryWithStore} from 'react-router-redux'
import {browserHistory} from 'react-router'
import {responsiveStateReducer, responsiveStoreEnhancer} from 'redux-responsive'
import {reducer as formReducer} from 'redux-form'
import createLogger from 'redux-logger'
import invariant from 'invariant'
import sweetalert from 'sweetalert'
import {Meteor} from 'meteor/meteor'
import thunk from 'redux-thunk'
import {ReactiveDict} from 'meteor/reactive-dict'
import {Tracker} from 'meteor/tracker'
import {Accounts} from 'meteor/accounts-base'
import DateFormatter from '/client/lib/date.formatter'
import Collections from '/lib/collections/index'
import UserService from '/lib/user.service'
import MentionParser from '/lib/mention.parser'

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
    form: formReducer.normalize(formNormalizers),
    browser: responsiveStateReducer,
    routing: routerReducer
  }
  for (const name of Object.keys(modules)) {
    invariant(!reducers[name], `Module of name '${name}' already exists`)
    // Atttempt to fix dev server problem
    if (modules[name].reducer) {
      reducers[name] = modules[name].reducer
    }
  }

  let middlewares = [routerMiddleware(browserHistory)]
  if (enableLogger) {
    middlewares.push(createLogger())
  }

  let enhancers = [
    applyMiddleware(...middlewares),
    responsiveStoreEnhancer
  ]
  if (typeof window === 'object' && window.devToolsExtension) {
    // Install https://github.com/zalmoxisus/redux-devtools-extension for pure magic!
    enhancers.push(window.devToolsExtension())
  }

  return createStore(
    combineReducers(reducers),
    compose(...enhancers),
    applyMiddleware(thunk)
  )
}

export function initContext (modules = {}) {
  const {settings: {public: settings}} = Meteor
  const store = createReduxStore(modules, settings.enableReduxLogger)
  return {
    Meteor,
    Collections,
    Tracker,
    Accounts,
    history: syncHistoryWithStore(browserHistory, store),
    sweetalert,
    UserService,
    DateFormatter,
    MentionParser: new MentionParser(Collections),
    currentUser: Meteor.user(),
    LocalState: new ReactiveDict(),
    store: store,
    audience: Meteor.settings.public.audience,
    settings
  }
}
