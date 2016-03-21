import React from 'react'
import Avatar from 'material-ui/lib/avatar'
import {Link} from 'react-router'
import {Flex} from 'jsxstyle'
import RaisedButton from 'material-ui/lib/raised-button'

const NavLink = (props) => (
  <Link activeClassName='active' {...props} />
)

const TopicsList = ({topics}) => (
  <Flex flexDirection='column' >
    <Flex flexDirection='row'>
      <span style={{width: '80%'}}>Topics</span>
      <NavLink to='#'>more</NavLink>
    </Flex>
    <ul style={s.topicsList}>
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
    <Flex flexDirection='row'>
      <span style={{width: '80%'}}>Direct Messages</span>
      <NavLink to='#'>more</NavLink>
    </Flex>
    <ul style={s.dmList}>
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

const AmaGuest = ({guest}) => {
  const capitalize = (s) => {
    return s.toUpperCase()
  }
  return (
    <Flex flexDirection='row' style={s.guestRow}>
      <Flex style={s.dateOutsideBox}>
        <Flex flexDirection='column' style={s.dateBox}>
          <span>{capitalize(guest.date)}</span>
          <span>{capitalize(guest.time)}</span>
        </Flex>
      </Flex>
      <Flex style={s.guestAvatarBox}>
        <Avatar src={guest.avatarUrl} style={s.guestAvatar}/>
      </Flex>
      <Flex flexDirection='column'>
        <b>{guest.name}</b>
        <p>{guest.description}</p>
      </Flex>
    </Flex>
  )
}

const AmaGuestList = ({guests}) => {
  return (
    <Flex flexDirection='column'>
      {guests.map((guest) =>
        <AmaGuest guest={guest}/>
      )}
    </Flex>
  )
}

export default React.createClass({
  getInitialState: function () {
    return {
      tab: 'Upcoming'
    }
  },

  tabItemClicked (e) {
    this.setState({
      tab: e.currentTarget.text
    })
  },

  render: function () {
    return (
      <div style={s.main}>
        <Flex flexDirection='row'>
          <Sidebar user={this.props.user} topics={this.props.topics} contacts={this.props.contacts}/>
          <Flex style={s.content}>
            <h2>#AMA Ask Me Anything</h2>
            <Flex style={s.amalist}>
              <Flex flexDirection='column'>
                <Flex flexDirection='row'>
                  <a href='#' onClick={this.tabItemClicked}>
                    <h3>Wanted</h3>
                  </a>
                  <a href='#' onClick={this.tabItemClicked}>
                    <h3>Upcoming</h3>
                  </a>
                  <a href='#' onClick={this.tabItemClicked}>
                    <h3>Past</h3>
                  </a>
                </Flex>
                {this.state.tab === 'Wanted'
                  ? <AmaGuestList guests={this.props.guests.wanted} />
                : null}
                {this.state.tab === 'Upcoming'
                  ? <AmaGuestList guests={this.props.guests.upcoming} />
                : null}
                {this.state.tab === 'Past'
                  ? <AmaGuestList guests={this.props.guests.past} />
                : null}
              </Flex>
            </Flex>
          </Flex>
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
  topicsList: {
    listStyle: 'none',
    textAlign: 'left'
  },
  dmList: {
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
  guestAvatarBox: {
    marginLeft: '10px',
    marginRight: '10px'
  },
  guestAvatar: {
    height: '100px',
    width: '100px'
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
  },
  dateOutsideBox: {
    borderRightColor: '#333333',
    borderRightStyle: 'solid',
    borderRightWidth: 1,
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '20px',
    paddingBottom: '20px'
  },
  guestRow: {
  },
  dateBox: {
    borderRadius: '5px',
    borderColor: '#333333',
    borderStyle: 'solid',
    borderWidth: 1,
    padding: '5px',
    width: '70px',
    height: '70px',
    textAlign: 'center'
  }
}
