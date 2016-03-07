import React from 'react'
import PostList from '/client/modules/core/containers/post.list'
import DirectorySearch from '/client/modules/core/containers/directory.search'
import _PostDetails from '/client/modules/core/containers/post.details'
import AddFollowers from '/client/modules/core/containers/add.followers'
import ToggleFollowing from '/client/modules/core/containers/toggleFollowing'
import Profile from '/client/modules/onboarding/components/profile.jsx'
import AmplitudeService from '/client/lib/amplitude.service'

export const TonyProfile = () =>
  <Profile displayName="Tony Xiao '12" firstName='Tony'
    avatarUrl='https://s10tv.blob.core.windows.net/s10tv-prod/tonyxiao.jpg' />

export const PoshakProfile = () =>
  <Profile displayName="Poshak Agrawal '13" firstName='Poshak'
    avatarUrl='http://graph.facebook.com/560625167/picture?type=large' />

export const GroupChannel = ({params}) => (
  <PostList topicId={params.channelId} />
)

GroupChannel.propTypes = {
  params: React.PropTypes.shape({
    channelId: React.PropTypes.string.isRequired
  }).isRequired
}

export const PostSearch = ({location: {query}}) => (
  <PostList postListType='SEARCH' term={query.term} />
)

export const AllPosts = () => (
  <PostList postListType='ALL' />
)

export const Directory = ({location: {query}}) => (
  <DirectorySearch term={query.term} />
)

export const PostDetails = ({params}) => (
  <_PostDetails topicId={params.channelId} postId={params.postId} />
)
PostDetails.propTypes = {
  params: React.PropTypes.shape({
    channelId: React.PropTypes.string.isRequired,
    postId: React.PropTypes.string.isRequired
  }).isRequired
}

export const GroupChannelAddMembers = ({params}) => (
  <AddFollowers topicId={params.channelId} />
)
GroupChannelAddMembers.propTypes = {
  params: React.PropTypes.shape({
    channelId: React.PropTypes.string.isRequired
  }).isRequired
}

export const GuestToggleFollowing = ({params}) => (
  <ToggleFollowing postId={params.postId} action={params.action} />
)

export function requireAuth ({Meteor}) {
  return (nextState, replace) => {
    if (!Meteor.userId()) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      })
    }
  }
}

export function requireNoAuth ({Meteor}) {
  return (nextState, replace) => {
    if (Meteor.userId()) {
      replace('/inbox')
    }
  }
}

export function redirectGuest ({Meteor}) {
  return (nextState, replace) => {
    if (!Meteor.userId()) {
      replace({ pathname: '/explore' })
    } else {
      replace({ pathname: '/login' })
    }
  }
}

export function redeemInvite ({Accounts, sweetalert, Meteor}) {
  return (nextState, replace, callback) => {
    Accounts.callLoginMethod({
      methodArguments: [{ invite: nextState.params.inviteId }],
      userCallback: (err) => {
        if (err) {
          sweetalert({
            title: 'Invalid Invite',
            text: 'Seems like your invite code is invalid or has already expired.\n' +
              'If retrying the invite link still doesn\'t work, please reply to the invite\n' +
              'email and we will investigate it.'
          }, () => {
            replace('/login')
            callback()
          })
        } else {
          AmplitudeService.setUpAfterSignup({Meteor})
          replace('/welcome/signup')
          callback()
        }
      }
    })
  }
}
