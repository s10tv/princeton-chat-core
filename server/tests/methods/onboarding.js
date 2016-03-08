/*global
  describe, beforeEach, Meteor, it
*/
import Collections from '../../../lib/collections'
import chai from 'chai'
import chaiTime from 'chai-datetime'

chai.use(chaiTime)

const {Users} = Collections

describe('onboarding methods', () => {
  let currentUser, currentUserId

  beforeEach(() => {
    Users.remove({})

    currentUserId = Users.insert({
      _id: 'current-user'
    })
    currentUser = Users.findOne(currentUserId)
    Meteor.user = () => {
      return currentUser
    }
  })

  describe('signup', () => {
    beforeEach(() => {
    })

    describe('signup/verifyAffiliation', () => {
      it('should verify affiliation', () => {
        Meteor.call('signup/verifyAffiliation', {
          firstName: 'john',
          lastName: 'smith',
          birthDate: '12/27/1981',
          classYear: '2016',
          degree: 'BS',
          email: 'john@smith.com'
        })
      })
    })
  })
})
