/*global
  describe, beforeEach, Meteor, it, fail
*/
import Collections from '../../../lib/collections'
import chai, {expect} from 'chai'
import chaiTime from 'chai-datetime'

chai.use(chaiTime)

const {Users, Invites} = Collections

describe('onboarding methods', () => {
  let currentUser, currentUserId

  beforeEach(() => {
    Users.remove({})
    Invites.remove({})

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
      const userJohn = {
        firstName: 'john',
        lastName: 'smith',
        birthDate: '12/27/1981',
        classYear: '2016',
        degree: 'BS',
        email: 'john@smith.com'
      }
      const userWithTooLongFirstName = {
        firstName: 'mytoolongfirstnamewithmorethansixteensymbols',
        lastName: 'lastname',
        birthDate: '12/29/1980',
        classYear: '2020',
        degree: 'BS',
        email: 'longname@lastname.com'
      }
      it('should verify affiliation and generate an invitation', () => {
        const invite = Meteor.call('signup/verifyAffiliation', userJohn)

        expect(invite.email).to.equal(userJohn.email)
        expect(invite.firstName).to.equal(userJohn.firstName)
        expect(invite.lastName).to.equal(userJohn.lastName)
        expect(invite.birthDate).to.equal(userJohn.birthDate)
        expect(invite.classYear).to.equal(userJohn.classYear)
        expect(invite.degree).to.equal(userJohn.degree)
        expect(invite.status).to.equal('pending')

        expect(Invites.find().count()).to.equal(1)
        const dbInvite = Invites.find().fetch()[0]

        expect(dbInvite.email).to.equal(userJohn.email)
        expect(dbInvite.firstName).to.equal(userJohn.firstName)
        expect(dbInvite.lastName).to.equal(userJohn.lastName)
        expect(dbInvite.birthDate).to.equal(userJohn.birthDate)
        expect(dbInvite.classYear).to.equal(userJohn.classYear)
        expect(dbInvite.degree).to.equal(userJohn.degree)
        expect(dbInvite.status).to.equal('pending')
      })
      it('should not allow users with, for example, too long first names', () => {
        try {
          Meteor.call('signup/verifyAffiliation', userWithTooLongFirstName)
          fail('first name is too long')
        } catch (err) {
          expect(err).to.exist
        }
      })
      it('should not allow users already registered email', () => {
        Users.insert({
          email: userJohn.email
        })
        try {
          Meteor.call('signup/verifyAffiliation', userJohn)
          fail('such email is already used')
        } catch (err) {
          expect(err).to.exist
        }
      })
    })

    describe('signup/alumni', () => {
      const userAdilet = {
        netid: 'adilet', 
        domain: 'adilet.org',
        classYear: 2016
      }
      it('should send signup email for alumni', () => {
        Meteor.call('signup/alumni', userAdilet)
      })
      it('should not allow users already registered email', () => {
        Users.insert({
          email: userAdilet.email
        })
        try {
          Meteor.call('signup/alumni', userAdilet)
          fail('such email is already used')
        } catch (err) {
          expect(err).to.exist
        }
      })
    })
  })
})
