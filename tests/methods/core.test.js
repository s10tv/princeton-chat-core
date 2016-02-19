import sinonChai from 'sinon-chai'
import chai, {expect} from 'chai'

import context from '../mocks'
import core from '../../server/methods/core'

chai.use(sinonChai)

const {Meteor, Collections, SearchService} = context
const {Users} = Collections

describe('methods/core', () => {
  beforeEach(() => {
    core(context)
  })

  beforeEach(() => {
    Users.remove({})

    Users.insert({
      _id: 'nigfang'
    })

    Meteor.currentUser = Users.findOne('nigfang')
  })

  describe('search/users', () => {
    it ('should fail if user is not authenticated', () => {
      Meteor.currentUser = undefined
      try {
        Meteor.call('search/users', 'tony')
        fail('should fail if user is not authenticated')
      } catch (err) {
        expect(SearchService.searchUsers).not.to.be.called
      }
    })

    it ('should search for users', () => {
      Meteor.call('search/users', 'tony')
      expect(SearchService.searchUsers).to.be.calledWith('tony')
    })
  })

  describe('search/posts', () => {
    it ('should fail if user is not authenticated', () => {
      Meteor.currentUser = undefined
      try {
        Meteor.call('search/posts', 'tony')
        fail('should fail if user is not authenticated')
      } catch (err) {
        expect(SearchService.searchPosts).not.to.be.called
      }
    })

    it ('should search for posts', () => {
      Meteor.call('search/posts', 'Trump for President!')
      expect(SearchService.searchPosts).to.be.calledWith('Trump for President!')
    })
  })
})
