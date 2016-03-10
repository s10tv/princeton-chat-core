import React from 'react'
import {IndexRoute, Route} from 'react-router'
import Helmet from 'react-helmet'

const wrap = (Component) => (location, cb) => {
  cb(null, Component)
}

const makeHelmet = (overrideProps) => () => (
  <Helmet
    title='Princeton.Chat'
    meta={[
      {property: 'fb:app_id', content: '942109702548809'},
      {property: 'og:url', content: 'https://princeton.chat'},
      {property: 'og:title', content: 'Princeton.Chat'},
      {property: 'og:type', content: 'website'},
      {property: 'og:description', content: 'A private community that connects Princetonians based on shared interests and common needs.'},
      {property: 'og:image', content: 'https://s10tv.blob.core.windows.net/s10tv-prod/princetonchat.jpg'},
      {name: 'description', content: 'A private community that connects Princetonians based on shared interests and common needs.'}
    ]} {...overrideProps} />
)

export default function ({Collections}) {
  return (
    <Route path='/'>
      <IndexRoute component={makeHelmet()} />
      <Route path='tonyx' component={() => makeHelmet({title: 'Tony Xiao'})} />
      <Route path='poshak' component={() => makeHelmet({title: 'Poshak Agrawal'})} />
      <Route path='channels/:channelId' getComponent={wrap(({params}) => {
        const channel = Collections.Topics.findOne(params.channelId)
        return channel ? makeHelmet({
          title: channel.displayName
        })() : <noscript />
      })} />
      <Route path='*' component={makeHelmet()} />
    </Route>
  )
}
