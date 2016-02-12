import {createStore, combineReducers, applyMiddleware} from 'redux'
import {reducer as formReducer} from 'redux-form'
import createLogger from 'redux-logger'

import {Meteor} from 'meteor/meteor'
import {FlowRouter} from 'meteor/kadira:flow-router'
import {ReactiveDict} from 'meteor/reactive-dict'
import {Tracker} from 'meteor/tracker'
import {Accounts} from 'meteor/accounts-base'
import Collections from '/lib/collections/index'

export function initContext () {
  const reducers = {
    form: formReducer
  }
  const logger = createLogger()
  const store = createStore(
    combineReducers(reducers),
    applyMiddleware(logger)
  )

  return {
    Meteor,
    FlowRouter,
    Collections,
    Tracker,
    Accounts,
    LocalState: new ReactiveDict(),
    store
  }
}
