import {Meteor} from 'meteor/meteor'
import {Accounts} from 'meteor/accounts-base'
import {Migrations} from 'meteor/percolate:migrations'
import {ServiceConfiguration} from 'meteor/service-configuration'
import Collections from '/lib/collections'
import {Random} from 'meteor/random'
import {HTTP} from 'meteor/http'
import {Email as _RealEmail} from 'meteor/email'
import {isTest} from '/lib/test'
import AvatarService from '/lib/avatar.service.js'
import FakeEmail from '/server/lib/fakes/FakeEmail'
import FakeSlack from '/server/lib/fakes/FakeSlack'
import PostManager from '/server/lib/PostManager'
import TopicManager from '/server/lib/TopicManager'
import OnboardManager from '/server/lib/OnboardManager'
import SearchService from '/server/lib/SearchService'
import Logger from '/server/lib/logger'
import UserService from '/lib/user.service'
import MentionParser from '/lib/mention.parser'
import Notifier from '/server/lib/Notifier'

// dependencies with fake alternatives
const Email = !isTest() ? _RealEmail : new FakeEmail()

const slackUrl = process.env.SLACK_URL || 'https://hooks.slack.com/services/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'
const slack = !isTest() ? Meteor.npmRequire('slack-notify')(slackUrl) : new FakeSlack()

const audience = process.env.AUDIENCE || 'princeton'

export const stripTrailingSlash = (str) => {
  if (str.substr(-1) === '/') {
    return str.substr(0, str.length - 1)
  }
  return str
}
const rootURL = stripTrailingSlash(process.env.ROOT_URL)

export function initContext () {
  return {
    // meteor libraries
    Meteor,
    Accounts,
    Migrations,
    ServiceConfiguration,
    Random,
    slack,

    // our exports
    audience,
    AvatarService,
    Logger,
    Collections,
    UserService,
    Notifier: new Notifier({ Collections }),
    MentionParser: new MentionParser({ Collections }),
    SearchService: new SearchService({ Meteor, Collections }),
    OnboardManager: new OnboardManager({ Meteor, Accounts, Email, Random, Collections, slack, rootURL, HTTP }),
    PostManager: new PostManager({Meteor, Collections}),
    TopicManager: new TopicManager({Meteor, Collections}),
    rootURL,
    currentUser: () => {
      const user = Meteor.user()
      if (!user) {
        Logger.log({ level: 'error', message: 'currentUser not found' })
        throw new Meteor.Error(401, 'Unauthorized')
      }
      Logger.log({ level: 'info', userId: user._id })
      return user
    }
  }
}
