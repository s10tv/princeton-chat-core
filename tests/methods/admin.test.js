import sinonChai from 'sinon-chai'
import chai, {expect} from 'chai'

import context from '../mocks'
import admin from '../../server/methods/admin'

chai.use(sinonChai)

const {Meteor, Collections, OnboardManager} = context
const {Users, Invites} = Collections

describe ('methods/admin', () => {
  beforeEach(() => {
    admin(context)
  })

  beforeEach(() => {
    Users.remove({})
    Invites.remove({})

    Users.insert({
      _id: 'not-admin',
      topicAdmins: []
    })

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
    it ('should fail if user is not authenticated', () => {
      Meteor.currentUser = undefined
      try {
        Meteor.call('admin/user/invite', 'inviteId')
        fail('should throw error if user is not authenticated')
      } catch (err) {
        expect(OnboardManager.handleManualVerify).not.to.be.called
      }
    })

    it ('should fail if user is not authenticated', () => {
      Meteor.currentUser = Users.findOne('not-admin')
      try {
        Meteor.call('admin/user/invite', 'inviteId')
        fail('should throw error if user is not authenticated')
      } catch (err) {
        expect(OnboardManager.handleManualVerify).not.to.be.called
      }
    })

    it ('should create manual invite', () => {
      Meteor.call('admin/user/invite', 'inviteId')
      expect(OnboardManager.handleManualVerify).calledWith({
        _id: 'inviteId'
      })
    })
  })

  describe ('admin/user/delete', () => {
    it ('should fail if user is not authenticated', () => {
      Meteor.currentUser = undefined
      try {
        Meteor.call('admin/invite/delete', 'inviteId')
        fail('should throw error if user is not authenticated')
      } catch (err) {
        expect(Invites.find().count()).to.equal(1)
      }
    })

    it ('should fail if user is not authenticated', () => {
      Meteor.currentUser = Users.findOne('not-admin')
      try {
        Meteor.call('admin/invite/delete', 'inviteId')
        fail('should throw error if user is not authenticated')
      } catch (err) {
        expect(Invites.find().count()).to.equal(1)
      }
    })

    it ('should remove the invite', () => {
      Meteor.call('admin/invite/delete', 'inviteId')
      expect(Invites.find().count()).to.equal(0)
    })
  })
})
