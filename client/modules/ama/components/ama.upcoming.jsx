import React from 'react'
import {Link} from 'react-router'
import {Flex} from 'jsxstyle'
import RaisedButton from 'material-ui/lib/raised-button'

const NavLink = (props) => (
  <Link activeClassName='active' {...props} />
)

const TopicsList = ({topics}) => (
  <Flex flexDirection='column' >
    <h4>Topics</h4>
    <ul>
      {topics.map((topic) =>
        <li>
          <NavLink to='#'>{`#${topic.displayName}`}</NavLink>
        </li>
      )}
    </ul>
  </Flex>
)

const DirectMessagesList = ({contacts}) => (
  <Flex flexDirection='column' >
    <h4>Direct Messages</h4>
    <ul>
      {contacts.map((contact) =>
        <li>
          <NavLink to='#'>{`@${contact.name}`}</NavLink>
        </li>
      )}
    </ul>
  </Flex>
)

const Sidebar = ({user, topics, contacts}) => (
  <Flex style={s.sidebar}>
    <Flex flexDirection='column' style={s.sidebarUsername}>
      <h3>princeton.chat</h3>
      <h4>{user}</h4>
    </Flex>
    <Flex flexDirection='column' style={s.sidebarContent}>
      <RaisedButton primary label='Post' labelPosition='after'/>
      <ul>
        <li style={s.navigationLinks}><NavLink to='#'>My Feed</NavLink></li>
        <li style={s.navigationLinks}><NavLink to='#'>All Posts</NavLink></li>
      </ul>
      <TopicsList topics={topics}/>
      <DirectMessagesList contacts={contacts}/>
    </Flex>
  </Flex>
)

const AmaGuestList = () => (
  <Flex flexDirection='row'>
    <a href='#'>
      <h3>Top</h3>
    </a>
    <a href='#'>
      <h3>Recent</h3>
    </a>
    <a href='#'>
      <h3>Create New</h3>
    </a>
  </Flex>
)

const Content = () => (
  <Flex style={s.content}>
    <h2>#AMA Ask Me Anything</h2>
    <Flex style={s.amalist}>
      <AmaGuestList />
    </Flex>
  </Flex>
)

export default React.createClass({
  render: function () {
    return (
      <div style={s.main}>
        <Flex flexDirection='row'>
          <Sidebar user={this.props.user} topics={this.props.topics} contacts={this.props.contacts}/>
          <Content />
        </Flex>
      </div>
    )
  }
})

const s = {
  main: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    '@media (max-width: 768px)': {
      height: 'initial',
      minHeight: '100vh'
    },
    backgroundColor: '#F7F7F7'
  },
  sidebar: {
    width: '20%',
    height: '100vh',
    flexDirection: 'column',
    borderRightColor: '#333333',
    borderRightStyle: 'solid',
    borderRightWidth: 1
  },
  navigationLinks: {
    marginTop: '10px',
    listStyle: 'none'
  },
  sidebarUsername: {
    paddingLeft: '20px',
    paddingTop: '15px',
    borderBottomColor: '#333333',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1
  },
  sidebarContent: {
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px'
  },
  content: {
    width: '100%',
    paddingLeft: '20px',
    paddingTop: '15px',
    flexDirection: 'column'
  },
  amalist: {
    marginTop: '5vh',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '70%',
    height: '80vh',
    backgroundColor: '#FFFFFF'
  }
}
