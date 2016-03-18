import {composeAll} from 'mantra-core'
import AmaUpcoming from '/client/modules/ama/components/ama.upcoming.jsx'
import React from 'react'

const fixtureProps = {
  user: 'Adilet',
  timestamp: new Date(),
  topics: [
    {displayName: 'Software'},
    {displayName: 'Product'},
    {displayName: 'Design'},
    {displayName: 'Hardware'},
    {displayName: 'Science'}
  ],
  contacts: [
    {name: 'armansu'},
    {name: 'minqij'},
    {name: 'musk'}
  ]
}

const fakeProps = (props) =>
  (Component) =>
    () => React.createElement(Component, props)

export default composeAll(
  fakeProps(fixtureProps)
)(AmaUpcoming)
