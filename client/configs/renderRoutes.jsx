import {Router, Route, browserHistory, Link} from 'react-router'
import {mount} from 'react-mounter'
import React from 'react'
import LayoutMain from '/client/modules/core/containers/layout'
import Inbox from '/client/modules/core/containers/inbox'
import Settings from '/client/modules/core/containers/settings'
import PostList from '/client/modules/core/containers/post.list'
import TopicList from '/client/modules/core/containers/topic.list'
import ErrorPage from '/client/modules/core/components/error.jsx'

export default function (injectDeps) {
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
      <Route path='/' component={LayoutMain}>
        <Route path='inbox' component={Inbox} />
        <Route path='settings' component={Settings} />
        <Route path='choose-topics' component={TopicList} />
      </Route>
      <Route path='*' component={ErrorPage}/>
    </Router>
  )
  const AppWithCtx = injectDeps(App)

  mount(() => (
    <AppWithCtx />
  ))
}
