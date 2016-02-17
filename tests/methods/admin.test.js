import { expect } from 'chai'

import context from '../mocks'
import admin from '../../server/methods/admin'

const {Meteor, Collections, OnboardManager} = context
const {Users, Invites} = Collections

describe ('methods/admin', () => {
  beforeEach(() => {
    admin(context)
  })

  beforeEach(() => {
    Users.insert({
      _id: 'qiming',
      topicAdmins: ['global']
    })

    Invites.insert({
      _id: 'inviteId'
    })

    Meteor.currentUser = Users.findOne('qiming')
  })


  describe ('admin/user/invite', () => {
    it ('should create manual invite', () => {
      Meteor.call('admin/user/invite', 'inviteId')
      expect(OnboardManager.handleManualVerify.called).to.be.true
    })
  })
})
