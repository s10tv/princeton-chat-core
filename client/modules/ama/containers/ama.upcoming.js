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
  ],
  guests: {
    upcoming: [
      {
        name: 'Eric Clapton',
        classYear: '83',
        description: 'Solo guitarist and a member of Cream',
        date: 'Mar 3',
        time: '5pm',
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Eric_%22slowhand%22_Clapton.jpg'
      },
      {
        name: 'Mark Knopfler',
        classYear: '81',
        description: 'Lead Guitarist of Dire Straits',
        date: 'Mar 19',
        time: '7pm',
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Mark_Knopfler_en_Bilbao.jpg'
      }
    ],
    wanted: [
      {
        name: 'James Hetfield',
        classYear: '80',
        description: 'Guitarist of Metallica',
        date: 'Mar 27',
        time: '5pm',
        avatarUrl: 'http://nineriverswellness.com/wp-content/uploads/2014/10/James-Hetfield-happy.jpg'
      }
    ],
    past: [
      {
        name: 'John Petrucci',
        classYear: '85',
        description: 'Guitarist of Dream Theater',
        date: 'Feb 29',
        time: '9pm',
        avatarUrl: 'http://www.metalsucks.net/wp-content/uploads/2013/09/john_petrucci_live_4.jpg'
      }
    ]
  }
}

const fakeProps = (props) =>
  (Component) =>
    () => React.createElement(Component, props)

export default composeAll(
  fakeProps(fixtureProps)
)(AmaUpcoming)
