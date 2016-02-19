import sinonChai from 'sinon-chai'
import chai, {expect} from 'chai'

import context from '../mocks'
import SearchService from '../../server/lib/SearchService.js'

chai.use(sinonChai)

const {Meteor, Collections} = context
const {Users, Posts} = Collections

describe('lib/searchservice', () => {
  let service

  beforeEach(() => {
    service = new SearchService({Meteor, Collections})
  })

  describe('search users', () => {
    beforeEach(() => {
      Users.remove({})

      Users.insert({
        _id: '1',
        status: 'active',
        username: 'icanhazusername'
      })

      Users.insert({
        _id: '2',
        status: 'active',
        firstName: 'icanhazfirstname'
      })

      Users.insert({
        _id: '3',
        status: 'active',
        lastName: 'icanhazlastname'
      })

      Users.insert({
        _id: '4',
        status: 'active',
        emails: [
          {
            address: 'icanhazemail'
          }
        ]
      })

      Users.insert({
        _id: '5',
        status: 'pending',
        firstName: 'notactive'
      })

      Users.insert({
        _id: '6',
        status: 'active',
        firstName: 'icanhaz6'
      })

      Users.insert({
        _id: '7',
        status: 'active',
        firstName: 'icanhaz7'
      })

      Users.insert({
        _id: '8',
        status: 'active',
        firstName: 'icanhaz8'
      })

      Users.insert({
        _id: '9',
        status: 'active',
        firstName: 'icanhaz9'
      })

      Users.insert({
        _id: '10',
        status: 'active',
        firstName: 'icanhaz10'
      })

      Users.insert({
        _id: '11',
        status: 'active',
        firstName: 'icanhaz11'
      })
    })

    it("shouldn't find any users", () => {
      expect(service.searchUsers('noname').fetch()).to.be.empty
    })

    it("shouldn't find any inactive users", () => {
      expect(service.searchUsers('notactive').fetch()).to.be.empty
    })

    it("should find by first name", () => {
      const foundUsers = service.searchUsers('firstname').fetch()
      expect(foundUsers).to.have.length(1)
      expect(foundUsers).to.have.deep.property('[0].firstName', 'icanhazfirstname')
    })

    it("should find by last name", () => {
      const foundUsers = service.searchUsers('lastname').fetch()
      expect(foundUsers).to.have.length(1)
      expect(foundUsers).to.have.deep.property('[0].lastName', 'icanhazlastname')
    })

    it("should find by email", () => {
      const foundUsers = service.searchUsers('email').fetch()
      expect(foundUsers).to.have.length(1)
      expect(foundUsers).to.have.deep.property('[0].emails[0].address', 'icanhazemail')
    })

    it("should find by username", () => {
      const foundUsers = service.searchUsers('username').fetch()
      expect(foundUsers).to.have.length(1)
      expect(foundUsers).to.have.deep.property('[0].username', 'icanhazusername')
    })

    it("should find by multiple fields and limit to 10", () => {
      const foundUsers = service.searchUsers('icanhaz').fetch()
      expect(foundUsers).to.have.length(10)
    })
  })

  describe('search posts', () => {
    beforeEach(() => {
      Posts.remove({})

      Posts.insert({
        _id: '1',
        title: 'Android Man was here',
        content: 'Kill John Lennon'
      })

      Posts.insert({
        _id: '2',
        title: 'Robocop was here',
        content: 'Whoa, it was released 28 years ago!'
      })
    })

    it("shouldn't find any posts", () => {
      const foundPosts = service.searchPosts('thirtythree').fetch()
      expect(foundPosts).to.be.empty
    })

    it('should find by title', () => {
      const foundPosts = service.searchPosts('android').fetch()
      expect(foundPosts).to.have.length(1)
      expect(foundPosts).to.have.deep.property('[0].title', 'Android Man was here')
    })

    it('should find by content', () => {
      const foundPosts = service.searchPosts('YEARS AGO').fetch()
      expect(foundPosts).to.have.length(1)
      expect(foundPosts).to.have.deep.property('[0].content', 'Whoa, it was released 28 years ago!')
    })

    it('should find by multiple fields', () => {
      const foundPosts = service.searchPosts('was here').fetch()
      expect(foundPosts).to.have.length(2)
    })
  })
})
