import React from 'react'
import {Router, Route, IndexRoute, IndexRedirect} from 'react-router'
import {injectDeps} from 'react-simple-di'
// Core
import LayoutMain from '/client/modules/core/containers/layout'
import Inbox from '/client/modules/core/containers/inbox'
import Settings from '/client/modules/core/containers/settings'
import TopicList from '/client/modules/core/containers/topic.list'
import ErrorPage from '/client/modules/core/components/error.jsx'
import CreateNewPost from '/client/modules/core/containers/post.create'
// AMA
import AdminInvite from '/client/modules/admin/containers/admin.invite'
import AmaDetails from '/client/modules/ama/containers/ama.details'
import AmaUpcoming from '/client/modules/ama/containers/ama.upcoming'
// Onboarding
import Signup from '/client/modules/onboarding/containers/signup'
import Login from '/client/modules/onboarding/containers/login'
import Home from '/client/modules/onboarding/containers/home'
import RequestInvite from '/client/modules/onboarding/containers/invite.request'
import SubscribeChannels from '/client/modules/onboarding/containers/subscribe.channels'
import InviteFriends from '/client/modules/onboarding/containers/invite.friends'
import ForgotPasswordSent from '/client/modules/onboarding/containers/forgotpassword.sent'
import ForgotPasswordChange from '/client/modules/onboarding/containers/forgotpassword.change'
import ForgotPassword from '/client/modules/onboarding/containers/forgotpassword'
import ForgotPasswordSuccess from '/client/modules/onboarding/containers/forgotpassword.success'
import EnterNames from '/client/modules/onboarding/containers/name'

import {GroupChannel, AllPosts, Directory, PostDetails, GroupChannelAddMembers,
  TonyProfile, PoshakProfile, GuestToggleFollowing, PostSearch,
  requireStatus, redeemInvite} from './configs/temp.jsx'

export default (context, actions) => {
  const RouterWithCtx = injectDeps(context, actions)(Router)
  return (
    <RouterWithCtx history={context.history}>
      <Route path='ama-upcoming' component={AmaUpcoming} />
      <Route path='tonyx' component={TonyProfile} />
      <Route path='poshak' component={PoshakProfile} />
      <Route path='/'>
        <IndexRoute component={Home} onEnter={requireStatus(context, null)} />
        <Route path='login' component={Login} />
        <Route path='request-invite' component={RequestInvite} />
        <Route path='invite/:inviteId' onEnter={redeemInvite(context)} />
        <Route path='welcome' onEnter={requireStatus(context, 'pending')}>
          <Route path='signup' component={Signup} />
          <Route path='enter-names' component={EnterNames} />
          <Route path='subscribe-channels' component={SubscribeChannels} />
          <Route path='invite-friends' component={InviteFriends} />
        </Route>
        <Route path='forgot-password' onEnter={requireStatus(context, null)}>
          <IndexRoute component={ForgotPassword} />
          <Route path='email-sent' component={ForgotPasswordSent} />
          <Route path='success' component={ForgotPasswordSuccess} />
          <Route path=':token' component={ForgotPasswordChange} />
        </Route>
      </Route>
      <Route path='/' component={LayoutMain} onEnter={requireStatus(context, 'active')}>
        <Route path='inbox' component={Inbox} />
        <Route path='settings' component={Settings} />
        <Route path='explore' component={TopicList} />
        <Route path='all' component={AllPosts} />
        <Route path='search' component={PostSearch} />
        <Route path='directory-search' component={Directory} />
        <Route path='add-post' component={CreateNewPost} />
        <Route path='channels/:channelId' component={GroupChannel} />
        <Route path='channels/:channelId/add-subscribers' component={GroupChannelAddMembers} />
        <Route path='channels/:channelId/:postId' component={PostDetails} />
      </Route>
      <Route path='/ama' component={LayoutMain} onEnter={requireStatus(context, 'active')}>
        <Route path=':amaPostId' component={AmaDetails} />
      </Route>
      <Route path='/admin' component={LayoutMain} onEnter={requireStatus(context, 'active')}>
        <IndexRedirect to='invite' />
        <Route path='invite' component={AdminInvite} />
      </Route>
      <Route path='/guest' onEnter={requireStatus(context, ['pending', 'active'])}>
        <IndexRedirect to='/' />
        <Route path='posts/:postId/:action' component={GuestToggleFollowing} />
      </Route>
      <Route path='*' component={ErrorPage}/>
    </RouterWithCtx>
  )
}
