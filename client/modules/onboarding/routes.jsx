import React from 'react'
import {mount} from 'react-mounter'

import Home from './containers/home'
import RequestInvite from './components/request-invite.jsx'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { RouteTransition, presets } from 'react-router-transition'

import { spring } from 'react-motion';

const fadeConfig = { stiffness: 200, damping: 22 };
const popConfig = { stiffness: 360, damping: 25 };
const slideConfig = { stiffness: 330, damping: 30 };

const WelcomeComponent = () => <h1>Hello World</h1>

class App extends React.Component {
  render() {
    return (
      <RouteTransition
          pathname={this.props.location.pathname}

          atEnter={{ opacity: 0.5 }}
          atLeave={{ opacity: 0.5 }}
          atActive={{ opacity: 1 }}
        >
      {this.props.children}
      </RouteTransition>
    )
  }
}
export default function (injectDeps, {FlowRouter, Router, Route, browserHistory}) {
  // mount(() => (<h1>Hello</h1>))
  // mount(<h1>Hello</h1>)

  mount(() => (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <Route path='o/request-invite' component={injectDeps(RequestInvite)}/>
        <Route path='o' component={injectDeps(Home)}/>
      </Route>
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
