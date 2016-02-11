import Collections from '/lib/collections/index'
import {Meteor} from 'meteor/meteor'
import {FlowRouter} from 'meteor/kadira:flow-router'
import {ReactiveDict} from 'meteor/reactive-dict'
import {Tracker} from 'meteor/tracker'
import {Accounts} from 'meteor/accounts-base'

export function initContext () {
  return {
    Meteor,
    FlowRouter,
    Collections,
    Tracker,
    Accounts,
    LocalState: new ReactiveDict()
  }
}
