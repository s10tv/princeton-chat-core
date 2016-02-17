import {Meteor} from 'meteor/meteor'
import {Accounts} from 'meteor/accounts-base'
import {Migrations} from 'meteor/percolate:migrations'
import Collections from '/lib/collections'

export function initContext () {
  return {
    Meteor,
    Accounts,
    Migrations,
    Collections
  }
}
