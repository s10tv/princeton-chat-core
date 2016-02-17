import sinon from 'sinon'

import MockMeteor from './MockMeteor'
import Collections from './MockCollection'

class MockOnboardingManger {
  handleManualVerify(invite) {
    this.manualInvite = invite
  }
}

export default {
  Meteor: new MockMeteor(),
  Collections,
  check: () => {},
  OnboardManager: new MockOnboardingManger()
}