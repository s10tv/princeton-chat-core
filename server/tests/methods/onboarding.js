/*global
  describe, beforeEach, Meteor, it, fail
*/
import Collections from '../../../lib/collections'
import chai, {expect} from 'chai'
import chaiTime from 'chai-datetime'
import { princeton } from '/lib/validation'

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
        classYear: '2016'
      }
      const userMissingData = {
        netid: 'missingdata'
      }
      it('should send signup email for alumni and generate invite', () => {
        Meteor.call('signup/alumni', userAdilet)

        expect(Invites.find().count()).to.equal(1)
        const dbInvite = Invites.find().fetch()[0]

        expect(dbInvite.email).to.equal(userAdilet.netid + '@' + userAdilet.domain)
        expect(dbInvite.classYear).to.equal(userAdilet.classYear)
        expect(dbInvite.status).to.equal('sent')
      })
      it('should detect incomplete data', () => {
        try {
          Meteor.call('signup/alumni', userMissingData)
          fail('missing domain')
        } catch (err) {
          expect(err).to.exist
        }
      })
      it('should not allow users with already registered email', () => {
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

  describe('profile', () => {
    describe('profile/avatar/useFacebook', () => {
      /* it('should use facebook avatar', () => {
        const facebookId = 'facebook-id'
        Users.update(currentUserId, { $set: {
          services: {
            facebook: {
              id: facebookId
            }
          }
        }})

        console.log(Users.findOne(currentUserId))

        Meteor.call('profile/avatar/useFacebook')

        const dbUser = Users.findOne(currentUserId)
        expect(dbUser.avatar.url).to.equal('https://graph.facebook.com/' + facebookId + '/picture?type=large')
        expect(dbUser.avatar.isDefaultAvatar).to.equal(false)
      }) */
      it('should detect if facebook is not linked', () => {
        try {
          Meteor.call('profile/avatar/useFacebook')
          fail('facebook is not linked')
        } catch (err) {
          expect(err).to.exist
        }
      })
    })

    describe('profile/avatar/useFilestack', () => {
      it('should use url as avatar', () => {
        const url = 'avatar-image-url'

        Meteor.call('profile/avatar/useFilestack', url)

        const dbUser = Users.findOne(currentUserId)
        expect(dbUser.avatar.url).to.equal(url)
        expect(dbUser.avatar.isDefaultAvatar).to.equal(false)
      })
    })

    describe('profile/avatar/useDefault', () => {
      it('should use default avatar', () => {
        Meteor.call('profile/avatar/useDefault')

        const dbUser = Users.findOne(currentUserId)
        expect(dbUser.avatar).to.have.property('url')
        expect(dbUser.avatar.isDefaultAvatar).to.equal(true)
        expect(dbUser.avatar).to.have.property('color')
      })
    })

    describe('profile/update', () => {
      const userJohn = {
        firstName: 'John',
        lastName: 'Smith',
        username: 'john',
        displayName: 'Johnny',
        classYear: '2017'
      }
      it('should update fields of current user', () => {
        Meteor.call('profile/update', userJohn)

        const dbUser = Users.findOne(currentUserId)
        expect(dbUser.firstName).to.equal(userJohn.firstName)
        expect(dbUser.lastName).to.equal(userJohn.lastName)
        expect(dbUser.username).to.equal(userJohn.username)
        expect(dbUser.displayName).to.equal(userJohn.displayName)
        expect(dbUser.classYear).to.equal(userJohn.classYear)
      })
      it('should not allow duplicate usernames', () => {
        Users.insert({
          username: 'john'
        })
        try {
          Meteor.call('profile/update', userJohn)
          fail('username is already taken')
        } catch (err) {
          expect(err).to.exist
        }
      })
    })
  })

  describe('welcome', () => {
    const userJohn = {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@smith.com',
      password: '12345'
    }
    const invitedPrincetonian = {
      firstName: 'adilet',
      lastName: 'zhaxybay',
      email: 'adilet.zhaxybay@alumni.princeton.edu'
    }
    const invitedNonPrincetonian1 = {
      firstName: 'jackie',
      lastName: 'chan',
      email: 'jackie@chan.com'
    }
    const invitedNonPrincetonian2 = {
      firstName: 'bruce',
      lastName: 'lee',
      email: 'bruce@lee.com'
    }

    describe('welcome/forgotPassword', () => {
      it('should detect if there is no user with such email', () => {
        try {
          Meteor.call('welcome/forgotPassword', {email: 'some-nonexistent-email-7579@example.com'})
          fail('there is no user with such email')
        } catch (err) {
          expect(err).to.exist
        }
      })
      it('should send recovery email', () => {
        Meteor.call('welcome/signup', userJohn)
        Meteor.call('welcome/forgotPassword', {email: userJohn.email})
      })
    })

    describe('welcome/signup', () => {
      it('should signup current user', () => {
        Meteor.call('welcome/signup', userJohn)

        const dbUser = Users.findOne(currentUserId)
        expect(dbUser.firstName).to.equal(userJohn.firstName)
        expect(dbUser.lastName).to.equal(userJohn.lastName)
      })
    })

    describe('welcome/linkfacebook', () => {
      /* it('should link facebook to current user', () => {
        const facebookId = 'facebook-id'
        const facebookFirstName = 'Eric'
        const facebookLastName = 'Clapton'
        Users.update(currentUserId, { $set: {
          services: {
            facebook: {
              id: facebookId,
              first_name: facebookFirstName,
              last_name: facebookLastName
            }
          }
        }})

        Meteor.call('welcome/linkfacebook')

        const dbUser = Users.findOne(currentUserId)
        expect(dbUser.firstName).to.equal(facebookFirstName)
        expect(dbUser.lastName).to.equal(facebookLastName)
        expect(dbUser.avatar.url).to.equal('https://graph.facebook.com/' + facebookId + '/picture?type=large')
        expect(dbUser.avatar.isDefaultAvatar).to.equal(false)
      }) */
    })

    describe('welcome/enternames', () => {
      it('should set display name to user', () => {
        const fullName = 'John Smith'
        Meteor.call('welcome/enternames', {
          fullName: fullName
        })

        const dbUser = Users.findOne(currentUserId)
        expect(dbUser.displayName).to.equal(fullName)
      })
      it('should detect that full name is missing in function call', () => {
        try {
          Meteor.call('welcome/enternames', {
            name: 'john'
          })
          fail('missing full name in function call')
        } catch (err) {
          expect(err).to.exist
        }
      })
    })

    describe('welcome/invite', () => {
      it('should generate invites for all invited people', () => {
        var invitees = [invitedPrincetonian, invitedNonPrincetonian1, invitedNonPrincetonian2]
        Meteor.call('welcome/invite', {
          invitees: invitees
        })

        expect(Invites.find().count()).to.equal(3)
        const dbInvites = Invites.find().fetch()

        dbInvites.forEach((invite) => {
          expect(invite.referredBy).to.equal(currentUserId)
          var currentEmail = invite.email
          var emailWasInvited = false
          for (var i = 0; i < invitees.length; i++) {
            if (invitees[i].email === currentEmail) {
              emailWasInvited = true
              break
            }
          }
          expect(emailWasInvited).to.equal(true)
          expect(invite.status).to.equal(princeton(currentEmail) === undefined ? 'sent' : 'pending-onboard')
        })
      })

      it('should not sent invites for already registered princetonians', () => {
        var invitees = [invitedPrincetonian, invitedNonPrincetonian1, invitedNonPrincetonian2]
        var inviteesNonPrincetonians = [invitedNonPrincetonian1, invitedNonPrincetonian2]

        var newUser = invitedPrincetonian
        newUser.password = '123'
        Meteor.call('welcome/signup', newUser)

        Meteor.call('welcome/invite', {
          invitees: invitees
        })

        expect(Invites.find().count()).to.equal(2)
        const dbInvites = Invites.find().fetch()

        dbInvites.forEach((invite) => {
          expect(invite.referredBy).to.equal(currentUserId)
          var currentEmail = invite.email
          var emailWasInvited = false
          for (var i = 0; i < inviteesNonPrincetonians.length; i++) {
            if (inviteesNonPrincetonians[i].email === currentEmail) {
              emailWasInvited = true
              break
            }
          }
          expect(emailWasInvited).to.equal(true)
          expect(invite.status).to.equal(princeton(currentEmail) === undefined ? 'sent' : 'pending-onboard')
        })
      })
    })

    describe('welcome/setLoginService', () => {
      it('should set login service', () => {
        Meteor.call('welcome/setLoginService', {
          serviceName: 'serviceName'
        })

        const dbUser = Users.findOne(currentUserId)
        expect(dbUser.emailPreference).to.equal('all')
        expect(dbUser.status).to.equal('active')
      })
    })
  })

  describe('user', () => {
    describe('user/setStatusActive', () => {
      it('should set status active', () => {
        Meteor.call('user/setStatusActive')

        const dbUser = Users.findOne(currentUserId)
        expect(dbUser.isFullMember).to.equal(true)
        expect(dbUser.status).to.equal('active')
      })
    })
  })
})
