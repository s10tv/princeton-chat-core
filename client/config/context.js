import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import {reducer as formReducer} from 'redux-form'
import { Router, Route, browserHistory } from 'react-router'
import createLogger from 'redux-logger'
import invariant from 'invariant'
import {Meteor} from 'meteor/meteor'
// import {FlowRouter} from 'meteor/kadira:flow-router'
import {ReactiveDict} from 'meteor/reactive-dict'
import {Tracker} from 'meteor/tracker'
import {Accounts} from 'meteor/accounts-base'
import Collections from '/lib/collections/index'

// TODO: Should probably add test for initModules function
// as well as better description & validation of module shape
const createReduxStore = (modules) => {
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
      formNormalizers[key] = normalize
    }
  }

  // Let each module define its own reducer, we'll then combine them all together
  // for use with redux store
  let reducers = {
    form: formReducer.normalize(formNormalizers)
  }
  for (const name of Object.keys(modules)) {
    invariant(!reducers[name], `Module of name '${name}' already exists`)
    reducers[name] = modules[name].reducer
  }

  // TODO: Let's disable logger middleware in production
  const logger = createLogger()
  return createStore(
    combineReducers(reducers),
    compose(
      applyMiddleware(logger),
      // Install https://github.com/zalmoxisus/redux-devtools-extension for pure magic!
      typeof window === 'object' && window.devToolsExtension ? window.devToolsExtension() : (f) => f
    )
  )
}

export function initContext (modules = {}) {
  return {
    Meteor,
    Router,
    Route,
    browserHistory,
    // FlowRouter,
    Collections,
    Tracker,
    Accounts,
    LocalState: new ReactiveDict(),
    store: createReduxStore(modules)
  }
}
