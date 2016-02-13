import {Meteor} from 'meteor/meteor'
import {Accounts} from 'meteor/accounts-base'
import {Migrations} from 'meteor/percolate:migrations'

export function initContext () {
  return {
    Meteor,
    Accounts,
    Migrations
  }
}
