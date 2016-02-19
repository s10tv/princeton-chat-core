import sinon from 'sinon'

import MockMeteor from './MockMeteor'
import Collections from './MockCollection'

const MockOnboardingManager = {
  handleManualVerify: sinon.spy()
}

const MockSearchService = {
  searchUsers: sinon.spy(),
  searchPosts: sinon.spy()
}

const Meteor = new MockMeteor()

export default {
  Meteor,
  Collections,
  check: () => {},
  currentUser: () => {
    const user = Meteor.user()
    if (!user) {
      throw new Meteor.Error(401, 'Unauthorized')
    }
    return user
  },
  OnboardManager: MockOnboardingManager,
  SearchService: MockSearchService
}
