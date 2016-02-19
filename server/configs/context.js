import {Meteor} from 'meteor/meteor'
import {Accounts} from 'meteor/accounts-base'
import {Migrations} from 'meteor/percolate:migrations'
import {ServiceConfiguration} from 'meteor/service-configuration'
import Collections from '/lib/collections'
import {Random} from 'meteor/random'
import {Match, check} from 'meteor/check'

import AvatarService from '/lib/avatar.service.js'
import PostManager from '/server/lib/PostManager'
import TopicManager from '/server/lib/TopicManager'
import OnboardManager from '/server/lib/OnboardManager'
import SearchService from '/server/lib/SearchService'

const slackUrl = process.env.SLACK_URL || 'https://hooks.slack.com/services/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'
const slack = Meteor.npmRequire('slack-notify')(slackUrl)

const audience = process.env.AUDIENCE || 'princeton'


export function initContext () {
  return {
    // meteor libraries
    Meteor,
    Accounts,
    Migrations,
    ServiceConfiguration,
    Random,
    Match,
    check,
    slack,

    // our exports
    audience,
    AvatarService,
    Collections,
    SearchService: new SearchService({ Meteor, Collections }),
    OnboardManager: new OnboardManager({ Meteor, Accounts, Email, Random, Collections, slack }),
    PostManager: new PostManager({Meteor, Collections}),
    TopicManager: new TopicManager({Meteor, Collections}),
    currentUser: () => {
      const user = Meteor.user()
      if (!user) {
        throw new Meteor.Error(401, 'Unauthorized')
      }
      return user
    }
  }
}
