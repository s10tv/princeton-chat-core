import sinonChai from 'sinon-chai'
import chai, {expect} from 'chai'

import context from '../mocks'
import admin from '../../server/methods/admin'

chai.use(sinonChai)

const {Meteor, Collections, OnboardManager} = context
const {Users, Invites} = Collections

