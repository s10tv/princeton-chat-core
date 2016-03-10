import React from 'react'
import {IndexRoute, Route} from 'react-router'
import Helmet from 'react-helmet'

const wrap = (Component) => (location, cb) => {
  cb(null, Component)
}

const makeHelmet = (info) => {
  const {title, description, image, url} = {
    title: 'Princeton.chat',
    description: 'A private community that connects Princetonians based on shared interests and common needs.',
    image: 'https://s10tv.blob.core.windows.net/s10tv-prod/princetonchat.jpg',
    url: 'https://princeton.chat',
    ...info
  }
  return <Helmet
    title={title}
    meta={[
      {property: 'fb:app_id', content: '942109702548809'},
      {property: 'og:url', content: url},
      {property: 'og:title', content: title},
      {property: 'og:type', content: 'website'},
      {property: 'og:description', content: description},
      {property: 'og:image', content: image},
      {name: 'description', content: description}
    ]} />
}

export default function ({Collections}) {
  return (
    <Route path='/'>
      <IndexRoute component={() => makeHelmet()} />
      <Route path='tonyx' component={() => makeHelmet({title: 'Tony Xiao'})} />
      <Route path='poshak' component={() => makeHelmet({title: 'Poshak Agrawal'})} />
      <Route path='channels/:channelId' getComponent={wrap(({params}) => {
        const channel = Collections.Topics.findOne(params.channelId)
        return channel ? makeHelmet({
          title: channel.displayName,
          url: channel.cover && channel.cover.url,
          description: channel.description
        }) : <noscript />
      })} />
      <Route path='*' component={() => makeHelmet()} />
    </Route>
  )
}
