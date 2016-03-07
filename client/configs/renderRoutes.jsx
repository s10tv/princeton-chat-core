import {Router, Route, browserHistory, Link} from 'react-router'
import {mount} from 'react-mounter'
import React from 'react'
import LayoutMain from '/client/modules/core/containers/layout'
import Inbox from '/client/modules/core/containers/inbox'
import Settings from '/client/modules/core/containers/settings'
import TopicList from '/client/modules/core/containers/topic.list'
import ErrorPage from '/client/modules/core/components/error.jsx'
import {GroupChannel, AllPosts, Directory,
  PostSearch} from '/client/modules/core/containers/temp.jsx'

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

export default function (injectDeps, {Meteor}) {
  console.log('inject', injectDeps)
  const Component = () => (
    <div>
      <h1>Hello World</h1>
      <Link to='hello2'>To 2</Link>
    </div>
  )
  const Component2 = () => (
    <div>
      <h1>Hello it's me</h1>
      <Link to='hello'>Back</Link>
    </div>
  )
  const App = () => (
    <Router history={browserHistory}>
      <Route path='/hello' component={Component} />
      <Route path='/hello2' component={Component2} />
      <Route path='/main' component={LayoutMain} />
      <Route path='/' component={LayoutMain} onEnter={requireAuth(Meteor)}>
        <Route path='inbox' component={Inbox} />
        <Route path='settings' component={Settings} />
        <Route path='explore' component={TopicList} />
        <Route path='all' component={AllPosts} />
        <Route path='search' component={PostSearch} />
        <Route path='directory' component={Directory} />
        <Route path='channels/:channelId' component={GroupChannel} />
      </Route>
      <Route path='*' component={ErrorPage}/>
    </Router>
  )
  const AppWithCtx = injectDeps(App)

  mount(() => (
    <AppWithCtx />
  ))
}
