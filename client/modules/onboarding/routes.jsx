import React from 'react'
import {mount} from 'react-mounter'

import Home from './containers/home'
import RequestInvite from './components/request-invite.jsx'
import createBrowserHistory from 'history/lib/createBrowserHistory'

const WelcomeComponent = () => <h1>Hello World</h1>
export default function (injectDeps, {FlowRouter, Router, Route, browserHistory}) {
  // mount(() => (<h1>Hello</h1>))
  // mount(<h1>Hello</h1>)

  mount(() => (
    <Router history={browserHistory}>
      <Route path='/o/request-invite' component={injectDeps(RequestInvite)}/>
      <Route path='/o' component={injectDeps(Home)}/>
    </Router>
  ))
  // mount(
  //   injectDeps(<h1>Hello World</h1>)
  // )
  
  // <Route path='/' component={App}>
  //   <Route path='users' component={Users}>
  //     <Route path='/user/:userId' component={User}/>
  //   </Route>
  //   <Route path='*' component={NoMatch}/>
  // </Route>
  
  // FlowRouter.route('/o/', {
  //   name: 'onboarding-home',
  //   action () {
  //     mount(injectDeps(Home))
  //   }
  // })
  // FlowRouter.route('/o/request-invite', {
  //   name: 'request-invite',
  //   action () {
  //     mount(injectDeps(RequestInvite))
  //   }
  // })
  
}
