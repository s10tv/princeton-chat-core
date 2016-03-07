import React from 'react'
import {Router, Route, IndexRoute, IndexRedirect} from 'react-router'
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
  requireAuth, requireNoAuth, redirectGuest, redeemInvite} from './configs/temp.jsx'

export default ({context}) => (
  <Router history={context.history}>
    <Route path='tonyx' component={TonyProfile} />
    <Route path='poshak' component={PoshakProfile} />
    <Route path='/'>
      <IndexRoute component={Home} onEnter={requireNoAuth(context)} />
      <Route path='login' component={Login} />
      <Route path='request-invite' component={RequestInvite} />
      <Route path='invite/:inviteId' onEnter={redeemInvite(context)} />
      <Route path='welcome' onEnter={requireAuth(context)}>
        <Route path='signup' component={Signup} />
        <Route path='enter-names' component={EnterNames} />
        <Route path='subscribe-channels' component={SubscribeChannels} />
        <Route path='invite-friends' component={InviteFriends} />
      </Route>
      <Route path='forgot-password'>
        <IndexRoute component={ForgotPassword} />
        <Route path='email-sent' component={ForgotPasswordSent} />
        <Route path='success' component={ForgotPasswordSuccess} />
        <Route path=':token' component={ForgotPasswordChange} />
      </Route>
    </Route>
    <Route path='/' component={LayoutMain} onEnter={requireAuth(context)}>
      <Route path='inbox' component={Inbox} />
      <Route path='settings' component={Settings} />
      <Route path='explore' component={TopicList} />
      <Route path='all' component={AllPosts} />
      <Route path='search' component={PostSearch} />
      <Route path='directory' component={Directory} />
      <Route path='add-post' component={CreateNewPost} />
      <Route path='channels/:channelId' component={GroupChannel} />
      <Route path='channels/:channelId/add-subscribers' component={GroupChannelAddMembers} />
      <Route path='channels/:channelId/:postId' component={PostDetails} />
    </Route>
    <Route path='/ama' component={LayoutMain}>
      <Route path=':amaPostId' component={AmaDetails} />
    </Route>
    <Route path='/admin' component={LayoutMain} onEnter={requireAuth(context)}>
      <IndexRedirect to='invite' />
      <Route path='invite' component={AdminInvite} />
    </Route>
    <Route path='/guest'>
      <IndexRoute onEnter={redirectGuest(context)} />
      <Route path='posts/:postId/:action' component={GuestToggleFollowing} />
    </Route>
    <Route path='*' component={ErrorPage}/>
  </Router>
)
