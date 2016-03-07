import {Router, Route, browserHistory, IndexRoute, Redirect} from 'react-router'
import {mount} from 'react-mounter'
import React from 'react'
import LayoutMain from '/client/modules/core/containers/layout'
import Inbox from '/client/modules/core/containers/inbox'
import Settings from '/client/modules/core/containers/settings'
import TopicList from '/client/modules/core/containers/topic.list'
import ErrorPage from '/client/modules/core/components/error.jsx'
import CreateNewPost from '/client/modules/core/containers/post.create'
import {GroupChannel, AllPosts, Directory, PostDetails, GroupChannelAddMembers,
  PostSearch} from '/client/modules/core/containers/temp.jsx'
import ToggleFollowing from '/client/modules/core/containers/toggleFollowing'

const GuestToggleFollowing = ({params}) => (
  <ToggleFollowing postId={params.postId} action={params.action} />
)

function requireAuth (Meteor) {
  return (nextState, replace) => {
    if (!Meteor.userId()) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      })
    }
  }
}

function redirectGuest (Meteor) {
  return (nextState, replace) => {
    if (!Meteor.userId()) {
      replace({ pathname: '/explore' })
    } else {
      replace({ pathname: '/login' })
    }
  }
}

export default function (injectDeps, {Meteor}) {
  const App = () => (
    <Router history={browserHistory}>
      <Route path='/' component={LayoutMain} onEnter={requireAuth(Meteor)}>
        <IndexRoute component={Inbox} />
        <Redirect from='inbox' to='/' />
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
      <Route path='/guest'>
        <IndexRoute onEnter={redirectGuest(Meteor)} />
        <Route path='posts/:postId/:action' component={GuestToggleFollowing} />
      </Route>
      <Route path='*' component={ErrorPage}/>
    </Router>
  )
  const AppWithCtx = injectDeps(App)

  mount(() => (
    <AppWithCtx />
  ))
}
