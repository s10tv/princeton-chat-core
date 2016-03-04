import {Meteor} from 'meteor/meteor'
import {Accounts} from 'meteor/accounts-base'
import {Migrations} from 'meteor/percolate:migrations'
import {ServiceConfiguration} from 'meteor/service-configuration'
import Collections from '/src/lib/collections'
import {Random} from 'meteor/random'
import {Email} from 'meteor/email'
import {HTTP} from 'meteor/http'
import AvatarService from '/src/lib/avatar.service.js'
import PostManager from '/src/server/lib/PostManager'
import TopicManager from '/src/server/lib/TopicManager'
import OnboardManager from '/src/server/lib/OnboardManager'
import SearchService from '/src/server/lib/SearchService'
import Logger from '/src/server/lib/logger'
import UserService from '/src/lib/user.service.js'
import MentionParser from '/src/lib/mention.parser.js'
import Notifier from '/src/server/lib/Notifier'
const slackUrl = process.env.SLACK_URL || 'https://hooks.slack.com/services/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'
const slack = Meteor.npmRequire('slack-notify')(slackUrl)

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
