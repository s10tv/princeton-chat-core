import {composeAll} from 'mantra-core'
import AmaUpcoming from '/client/modules/ama/components/ama.upcoming.jsx'
import React from 'react'

const fixtureProps = {
  user: 'adilet',
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
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Eric_%22slowhand%22_Clapton.jpg',
        commentsNum: '32',
        attending: '123',
        remind: 'true'
      },
      {
        name: 'Mark Knopfler',
        classYear: '81',
        description: 'Lead Guitarist of Dire Straits',
        date: 'Mar 19',
        time: '7pm',
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Mark_Knopfler_en_Bilbao.jpg',
        remind: 'true'
      },
      {
        name: 'Steve Vai',
        classYear: '89',
        description: 'Solo Guitarist',
        date: 'Apr 23',
        time: '7:30pm',
        avatarUrl: 'http://img.guitar-muse.com/wp-content/uploads/2012/07/steve-vai-brownvelvetjacket.jpg',
        commentsNum: '15'
      },
      {
        name: 'Joe Satriani',
        classYear: '79',
        description: 'Solo Guitarist',
        date: 'Apr 29',
        time: '8:30pm',
        avatarUrl: 'http://emertainmentmonthly.com/wp-content/uploads/2016/02/Joe-Satriani-Net-Worth.jpg',
        attending: '147'
      },
      {
        name: 'Slash',
        classYear: '83',
        description: 'Lead Guitarist of Guns\'n\'Roses',
        date: 'May 15',
        time: '7:pm',
        avatarUrl: 'http://bigread.mojo4music.com/2014/01/slash/img/slash-portrait.jpg'
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
