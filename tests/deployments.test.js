import { expect } from 'chai'
import Env from '../imports/libs/deployments'

describe('deployments file', () => {
  it ('should pass', () => {

    Object.keys(Env).forEach(envName => {
      const env = Env[envName];

      expect(env.title).to.exist;
      expect(env.tagline).to.exist;
      expect(env.placeholderEmail).to.exist;

    })

  })
})
