import sinon from 'sinon'

import MockMeteor from './MockMeteor'
import Collections from './MockCollection'

const MockOnboardingManger = {
  handleManualVerify: sinon.spy()
}

export default {
  Meteor: new MockMeteor(),
  Collections,
  check: () => {},
  OnboardManager: MockOnboardingManger
}