import React from 'react'
import {IndexRoute, Route} from 'react-router'
import Helmet from 'react-helmet'

const wrap = (Component) => (
  (location, cb) => {
    cb(null, Component)
  }
)

export default function ({Collections}) {
  return (
    <Route path='/'>
      <IndexRoute component={() => <Helmet title='Princeton.Chat' />} />
      <Route path='tonyx' component={() => <Helmet title='Tony Xiao' />} />
      <Route path='poshak' component={() => <Helmet title='Poshak Agrawal' />} />
      <Route path='channels/:channelId' getComponent={wrap(({params}) => {
        const channel = Collections.Topics.findOne(params.channelId)
        return channel ? (<Helmet title={channel.displayName} />) : <noscript />
        })} />
      <Route path='*' component={() => <Helmet title='Princeton.Chat | Not Found' />} />
    </Route>
  )
}
