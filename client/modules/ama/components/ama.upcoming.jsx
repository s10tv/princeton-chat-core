import React from 'react'
import Avatar from 'material-ui/lib/avatar'
import {Link} from 'react-router'
import {Flex} from 'jsxstyle'
import RaisedButton from 'material-ui/lib/raised-button'
import FontIcon from 'material-ui/lib/font-icon'

const NavLink = (props) => (
  <Link activeClassName='active' {...props} />
)

const TopicsList = ({topics}) => (
  <Flex flexDirection='column' >
    <Flex flexDirection='row'>
      <span style={{width: '90%', color: '#646464'}}>Topics</span>
      <span style={{height: '100%', verticalAlign: 'middle'}}>
        <NavLink to='#' style={s.smallGreyLink}>more</NavLink>
      </span>
    </Flex>
    <ul style={s.topicsList}>
      {topics.map((topic) =>
        <li>
          <NavLink to='#' style={s.greyLink}>{`#${topic.displayName}`}</NavLink>
        </li>
      )}
    </ul>
  </Flex>
)

const DirectMessagesList = ({contacts}) => (
  <Flex flexDirection='column' >
    <Flex flexDirection='row'>
      <span style={{width: '90%', color: '#646464'}}>Direct Messages</span>
      <span style={{height: '100%', verticalAlign: 'middle'}}>
        <NavLink to='#' style={s.smallGreyLink}>more</NavLink>
      </span>
    </Flex>
    <ul style={s.dmList}>
      {contacts.map((contact) =>
        <li>
          <NavLink to='#' style={s.greyLink}>{`@${contact.name}`}</NavLink>
        </li>
      )}
    </ul>
  </Flex>
)

const Sidebar = ({user, topics, contacts}) => (
  <Flex style={s.sidebar}>
    <Flex flexDirection='row' style={s.sidebarUsername}>
      <Flex>
        <Avatar style={s.userAvatar}/>
      </Flex>
      <Flex flexDirection='column'>
        <span style={s.princetonChat}>princeton.chat</span>
        <Flex flexDirection='row'>
          <div style={s.onlineCircle}></div>
          <span style={s.username}>{user}</span>
        </Flex>
      </Flex>
    </Flex>
    <Flex flexDirection='column' style={s.sidebarContent}>
      <RaisedButton
        secondary
        label='Post'
        labelPosition='after'>
        <FontIcon className='material-icons new-post-icon' color='white' style={s.addIcon}>
           add
        </FontIcon>
      </RaisedButton>
      <ul style={s.navigationLinks}>
        <li>
          <Flex flexDirection='row'>
            <FontIcon className='material-icons' color='black' style={s.navLinkIcon}>
               view_headline
            </FontIcon>
            <NavLink to='#' style={s.greyLink}>My Feed</NavLink>
          </Flex>
        </li>
        <li>
          <Flex flexDirection='row'>
            <FontIcon className='material-icons' color='black' style={s.navLinkIcon}>
               view_headline
            </FontIcon>
            <NavLink to='#' style={s.greyLink}>All Posts</NavLink>
          </Flex>
        </li>
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
      <Flex flexDirection='row' style={{width: '90%', height: '100%'}}>
        <Flex style={s.dateOutsideBox}>
          <Flex flexDirection='column' style={s.dateBox}>
            <span style={s.date}>
              {capitalize(guest.date)}
              <br/>
              {capitalize(guest.time)}
            </span>
          </Flex>
        </Flex>
        <Flex flexDirection='row' style={s.guestInfo}>
          <Flex style={s.guestAvatarBox}>
            <Avatar src={guest.avatarUrl} style={s.guestAvatar}/>
          </Flex>
          <Flex flexDirection='column'>
            <b>{guest.name + ' \'' + guest.classYear}</b>
            <span style={s.guestDescription}>{guest.description}</span>
            <Flex flexDirection='row'>
              {guest.remind === 'true' ? <span style={s.guestRemind}>Remind Me</span> : null}
              {guest.attending !== undefined ? <span style={s.guestAttending}>{guest.attending + ' ATTENDING'}</span> : null}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex>
        {guest.commentsNum !== undefined
          ? <Flex flexDirection='row' style={{marginTop: '30px'}}>
            <img src='/images/chat-bubble.svg' style={s.commentsIcon}/>
            <span style={s.guestCommentNum}>{guest.commentsNum}</span>
          </Flex>
        : null}
      </Flex>
    </Flex>
  )
}

const AmaGuestList = ({guests}) => {
  return (
    <Flex flexDirection='column' style={s.guestList}>
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
            <h3 style={s.contentHeader}>#AMA &nbsp; Ask Me Anything</h3>
            <Flex flexDirection='column' style={s.amalist}>
              <Flex flexDirection='row' style={s.tabHeader}>
                <span style={s.tabLinkBox}>
                  <a href='#'
                    style={this.state.tab === 'Wanted' ? s.tabSelectedLink : s.tabLink}
                    onClick={this.tabItemClicked}>
                    Wanted
                  </a>
                </span>
                <span style={s.tabLinkMiddleBox}>
                  <a href='#'
                    style={this.state.tab === 'Upcoming' ? s.tabSelectedLink : s.tabLink}
                    onClick={this.tabItemClicked}>
                    Upcoming
                  </a>
                </span>
                <span style={s.tabLinkBox}>
                  <a href='#'
                    style={this.state.tab === 'Past' ? s.tabSelectedLink : s.tabLink}
                    onClick={this.tabItemClicked}>
                    Past
                  </a>
                </span>
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
      </div>
    )
  }
})

const s = {
  addIcon: {
    height: '100%',
    verticalAlign: 'middle'
  },
  amalist: {
    marginTop: '5vh',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '20px',
    width: '70%',
    height: '80vh',
    backgroundColor: '#FFFFFF',
    borderColor: '#F2F2F2',
    borderWidth: 1,
    borderStyle: 'solid'
  },
  commentsIcon: {
    marginRight: '5px',
    width: '15px',
    height: '15px',
    opacity: '0.5'
  },
  content: {
    width: '100%',
    paddingLeft: '20px',
    paddingTop: '15px',
    flexDirection: 'column'
  },
  contentHeader: {
    color: '#646464'
  },
  date: {
    lineHeight: '20px',
    paddingTop: '10px',
    height: '100%',
    verticalAlign: 'middle',
    fontWeight: '700',
    fontSize: '0.9rem'
  },
  dateBox: {
    borderRadius: '5px',
    borderColor: '#9D9D9D',
    borderStyle: 'solid',
    borderWidth: 1,
    padding: '5px',
    width: '70px',
    height: '70px',
    textAlign: 'center'
  },
  dateOutsideBox: {
    borderRightColor: '#9D9D9D',
    borderRightStyle: 'solid',
    borderRightWidth: 1,
    paddingRight: '10px',
    paddingTop: '20px',
    height: '100%'
  },
  dmList: {
    listStyle: 'none',
    textAlign: 'left',
    paddingLeft: '15px',
    color: '#646464'
  },
  greyLink: {
    color: '#646464'
  },
  guestAttending: {
    marginTop: '3px',
    color: '#CCCCCC',
    fontWeight: '300',
    fontSize: '0.9rem'
  },
  guestAvatar: {
    height: '100px',
    width: '100px'
  },
  guestAvatarBox: {
    marginLeft: '10px',
    marginRight: '10px',
    height: '100%'
  },
  guestCommentNum: {
    fontSize: '0.9rem',
    color: '#CCCCCC',
    fontWeight: '300',
    lineHeight: '15px'
  },
  guestDescription: {
    color: '#CCCCCC',
    fontWeight: '300'
  },
  guestInfo: {
    paddingTop: '5px',
    paddingBottom: '5px',
    height: '100%'
  },
  guestList: {
    overflowY: 'scroll',
    marginTop: '10px'
  },
  guestRemind: {
    backgroundColor: '#EC7C60',
    color: '#FFFFFF',
    padding: '3px',
    lineHeight: '12px',
    marginTop: '5px',
    marginRight: '5px',
    fontWeight: '300',
    fontSize: '0.9rem',
    height: '18px'
  },
  guestRow: {
    height: '110px',
    flexShrink: '0'
  },
  main: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#F7F7F7'
  },
  navLinkIcon: {
    fontSize: '30px',
    marginRight: '5px'
  },
  navigationLinks: {
    marginTop: '10px',
    listStyle: 'none',
    paddingLeft: '0px',
    color: '#646464'
  },
  onlineCircle: {
    width: '10px',
    height: '10px',
    backgroundColor: '#D8D8D8',
    borderRadius: '5px',
    borderColor: '#A1A1A1',
    borderStyle: 'solid',
    borderWidth: 1,
    marginTop: '8px',
    marginRight: '5px',
    marginLeft: '3px',
    marginBottom: '3px'
  },
  postButton: {
    backgroundColor: '#4E92DF'
  },
  princetonChat: {
    lineHeight: '24px',
    fontSize: '1.25rem',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    color: '#646464'
  },
  smallGreyLink: {
    fontSize: '12px',
    color: '#646464'
  },
  sidebar: {
    width: '20%',
    height: '100vh',
    flexDirection: 'column',
    borderRightColor: '#9D9D9D',
    borderRightStyle: 'solid',
    borderRightWidth: 1
  },
  sidebarContent: {
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px'
  },
  sidebarUsername: {
    paddingLeft: '5px',
    paddingTop: '7px',
    paddingBottom: '7px',
    borderBottomColor: '#9D9D9D',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1
  },
  tabHeader: {
    borderBottomColor: '#F2F2F2',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    paddingBottom: '10px',
    paddingTop: '10px',
    width: '100%',
    flexShrink: '0'
  },
  tabLink: {
    color: '#CCCCCC'
  },
  tabLinkBox: {
    paddingLeft: '5px',
    paddingRight: '5px'
  },
  tabLinkMiddleBox: {
    paddingLeft: '5px',
    paddingRight: '5px',
    borderLeftColor: '#F2F2F2',
    borderLeftWidth: 1,
    borderLeftStyle: 'solid',
    borderRightColor: '#F2F2F2',
    borderRightWidth: 1,
    borderRightStyle: 'solid'
  },
  tabSelectedLink: {
    color: '#000000'
  },
  topicsList: {
    listStyle: 'none',
    textAlign: 'left',
    paddingLeft: '15px',
    color: '#646464'
  },
  userAvatar: {
    height: '50px',
    width: '50px',
    marginRight: '7px'
  },
  username: {
    lineHeight: '24px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    color: '#646464'
  }
}
