import {createOnSubmit} from '/client/lib/helpers'
import UserService from '/lib/user.service'
import { i18n } from '/client/configs/env'

export default {
  requestInvite: {
    verifyAffiliation: createOnSubmit('signup/verifyAffiliation')
  },
  onboardHome: {
    verifyAlumni: createOnSubmit('signup/alumni', ({sweetalert}) => {
      sweetalert({title: 'Invite Sent', text: 'Check your inbox now ;)'})
    })
  },
  login: {
    loginWithFacebook ({ Meteor, FlowRouter, sweetalert }) {
      Meteor.loginWithFacebook({}, (err) => {
        if (err) {
          return sweetalert({
            title: 'Facebook Login',
            text: err.message
          })
        }
        return FlowRouter.go('all-mine')
      })
    },
    loginWithPassword ({Accounts}, info) {
      Accounts.loginWithPassword(info.email, info.password, (err) => {
        if (err) {
          return sweetalert({
            title: 'Login',
            text: err.message
          })
        }
        return FlowRouter.go('all-mine')
      })
    }
  },
  onboardSignup: {
    createAccount: createOnSubmit('welcome/signup', ({ FlowRouter }) => {
      FlowRouter.go('onboard-subscribe-channels')
    }),
    linkWithFacebook ({Meteor, FlowRouter, sweetalert}) {
      Meteor.linkWithFacebook({}, (err) => {
        if (err) {
          return sweetalert({ title: 'Problem linking Facebook', text: err.message })
        }

        Meteor.call('welcome/linkfacebook', (err) => {
          if (err) {
            return sweetalert({ title: 'Problem linking Facebook', text: err.reason })
          }
          return FlowRouter.go('onboard-subscribe-channels')
        })
      })
    }
  },
  onboardChannels: {
    next ({FlowRouter, sweetalert}) {
      // TODO: extract this into context
      const currentUser = UserService.currentUser()

      if (currentUser.followingTopics.length < 3) {
        return sweetalert({
          title: 'Subscribe',
          text: `${i18n('title')} will be a lot more interesting the more channels you subscribe. \
            Please subscribe at least 3 before continuing.`
        })
      }

      return FlowRouter.go('invite-friends')
    }
  },
  onboardInvite: {
    invite: createOnSubmit('welcome/invite')
  }
}
