import chai, { expect } from 'chai'
import Env from '../imports/libs/i18n'

chai.use(function (_chai, _) {
  _chai.Assertion.addMethod('withMessage', function (msg) {
    _.flag(this, 'message', msg);
  });
});

describe('all envs in i18n file', () => {
  it ('should have all variables set', () => {
    Object.keys(Env).forEach(envName => {
      const env = Env[envName];

      expect(env.title).withMessage(`error in ${envName}`).to.exist;
      expect(env.tagline).withMessage(`error in ${envName}`).to.exist;
      expect(env.placeholderEmail).withMessage(`error in ${envName}`).to.exist;
      expect(env.community).withMessage(`error in ${envName}`).to.exist;
      expect(env.onboardingGreeting).withMessage(`error in ${envName}`).to.exist;
      expect(env.onboardingDesc).withMessage(`error in ${envName}`).to.exist;
      expect(env.favicon).withMessage(`error in ${envName}`).to.exist;
      expect(env.fbAppId).withMessage(`error in ${envName}`).to.exist;
      expect(env.ogUrl).withMessage(`error in ${envName}`).to.exist;
      expect(env.ogType).withMessage(`error in ${envName}`).to.exist;
      expect(env.ogTitle).withMessage(`error in ${envName}`).to.exist;
      expect(env.ogDescription).withMessage(`error in ${envName}`).to.exist;
      expect(env.ogImage).withMessage(`error in ${envName}`).to.exist;
      expect(env.topicMailServer).withMessage(`error in ${envName}`).to.exist;
      expect(env.defaultAvatar).withMessage(`error in ${envName}`).to.exist;
    })
  })
})
