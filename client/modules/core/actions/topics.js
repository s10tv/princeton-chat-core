// import UnsplashService from '/imports/libs/unsplash.service'
import { _ } from 'meteor/underscore'
import AmplitudeService from '/client/lib/amplitude.service'
import postFollowers from './postfollowers'

export default {
  createTopic ({Meteor, LocalState, history}, topicInfo, shouldRedirect) {
    Meteor.call('topic/create', topicInfo, (err, topicId) => {
      if (err) {
        return LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason)
      }

      AmplitudeService.track('success/topic/create')
      LocalState.set('SHOW_ADD_TOPIC_MODAL', false)
      if (shouldRedirect) {
        history.push(`/channels/${topicId}`)
      }
    })
  },

  showAddTopicModal ({ LocalState }) {
    AmplitudeService.track('start/topic/create')
    LocalState.set('SHOW_ADD_TOPIC_MODAL', true)
  },

  hideAddTopicModal ({ LocalState }) {
    LocalState.set('SHOW_ADD_TOPIC_MODAL', false)
  },

  showAddTopicCoverPhotoModal ({ LocalState }) {
    LocalState.set('SHOW_ADD_TOPIC_MODAL_COVER_PHOTO', true)
  },

  hideAddTopicCoverPhotoModal ({ LocalState }) {
    LocalState.set('SHOW_ADD_TOPIC_MODAL_COVER_PHOTO', false)
  },

  chooseCoverPhoto ({ LocalState }, photo) {
    LocalState.set('ADD_TOPIC_MODAL_CURRENT_COVER_PHOTO', photo)
  },

  removeTopic ({ Meteor, LocalState, history }, topicId) {
    Meteor.call('topic/remove', topicId, (err, res) => {
      if (err) {
        return LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason)
      }
    })

    history.push('/')
  },

  // begin sidebar methods (to navigate to differnet topics)
  navigateToChannel ({ history, LocalState }, topic) {
    if (!topic) {
      return
    }

    switch (topic.type) {
      case 'ama':
        return history.push(`/ama/${topic._id}`)

      case 'postlist':
      default:
        return history.push(`/channels/${topic._id}`)
    }
  },

  // BEING DEPRECATED. Use navigateToChannel
  navigateToTopic ({ history, LocalState }, topicId) {
    // if we were in mobile mode, and showing sidebar, hide sidebar now
    LocalState.set('SHOW_SIDE_BAR', false)

    return history.push(`/channels/${topicId}`)
  },
  navigateToTopicList ({ history, LocalState }) {
    // if we were in mobile mode, and showing sidebar, hide sidebar now
    LocalState.set('SHOW_SIDE_BAR', false)

    return history.push('/explore')
  },
  navigateTo ({ history, LocalState }, url) {
    // if we were in mobile mode, and showing sidebar, hide sidebar now
    LocalState.set('SHOW_SIDE_BAR', false)

    return history.push(url)
  },

  navigateToAddFollowers ({ history }, topicId) {
    AmplitudeService.track('start/topic/addfollowers')
    return history.push(`/channels/${topicId}/add-followers`)
  },

  updateTopicFollowers (context, topicIds) {
    const { Meteor, Collections } = context

    const userIdMap = Collections.Topics.find({_id: { $in: topicIds }})
      .fetch()
      .reduce((acc, topic) => {
        topic.followers.forEach((follower) => {
          acc[follower.userId] = follower
        })
        return acc
      }, {})

    if (Meteor.userId()) {
      delete userIdMap[Meteor.userId()]
    }

    const followers = _.map(userIdMap, (val) => {
      return val
    })

    postFollowers.getPostFollowers(context, followers)
  },

  showTopicFollowers ({ LocalState }) {
    LocalState.set('FOLLOWERS_MODAL_OPEN', true)
  },

  follow ({Meteor, LocalState}, topicId) {
    Meteor.call('topic/follow', topicId, (err) => {
      if (err) {
        LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason)
      }
    })
  },

  unfollow ({Meteor, LocalState}, topicId) {
    Meteor.call('topic/unfollow', topicId, (err) => {
      if (err) {
        LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason)
      }
    })
  },

  addNewUsers ({Meteor, LocalState, history}, topicId, userInfos) {
    Meteor.call('topics/users/import', topicId, userInfos, (err) => {
      if (err) {
        return LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason)
      }

      LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', 'Followers successfully added!')
      AmplitudeService.track('success/topic/addfollowers')
      history.push(`/channels/${topicId}`)
    })
  },

  removeFollower ({Meteor, LocalState}, topicId, userId) {
    Meteor.call('topic/removeFollower', topicId, userId, (err) => {
      if (err) {
        return LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason)
      }

      LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', 'Follower successfully removed!')
    })
  },

  showSnackbarWithString ({ LocalState }, str) {
    LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', str)
  }
}
