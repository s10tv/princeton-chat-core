import {composeAll} from 'mantra-core'
import AmaUpcoming from '/client/modules/ama/components/ama.upcoming.jsx'
import React from 'react'

const fixtureProps = {
  user: 'Adilet',
  timestamp: new Date()
}

const fakeProps = (props) =>
  (Component) =>
    () => React.createElement(Component, props)

export default composeAll(
  fakeProps(fixtureProps)
)(AmaUpcoming)
