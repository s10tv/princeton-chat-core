import React from 'react'
import Avatar from 'material-ui/lib/avatar'
import {Link} from 'react-router'
import RaisedButton from 'material-ui/lib/raised-button'
import FontIcon from 'material-ui/lib/font-icon'

const NavLink = (props) => (
  <Link activeClassName='active' {...props} />
)

const TopicsList = ({topics}) => (
  <div className='flex-column'>
    <div className='flex-row'>
      <span className='topics-header'>Topics</span>
      <span className='topics-more'>
        <NavLink to='#' className='small-grey-link'>more</NavLink>
      </span>
    </div>
    <ul className='topics-list'>
      {topics.map((topic) =>
        <li>
          <NavLink to='#' className='grey-link'>{`#${topic.displayName}`}</NavLink>
        </li>
      )}
    </ul>
  </div>
)

const DirectMessagesList = ({contacts}) => (
  <div className='flex-column'>
    <div className='flex-row'>
      <span className='dm-header'>Direct Messages</span>
      <span className='dm-more'>
        <NavLink to='#' className='small-grey-link'>more</NavLink>
      </span>
    </div>
    <ul className='dm-list'>
      {contacts.map((contact) =>
        <li>
          <NavLink to='#' className='grey-link'>{`@${contact.name}`}</NavLink>
        </li>
      )}
    </ul>
  </div>
)

const Sidebar = ({user, topics, contacts}) => (
  <div className='sidebar'>
    <div className='sidebar-username'>
      <div className='flex'>
        <Avatar size={50} className='user-avatar'/>
      </div>
      <div className='flex-column'>
        <span className='princeton-chat'>princeton.chat</span>
        <div className='flex-row'>
          <div className='online-circle'></div>
          <span className='username'>{user}</span>
        </div>
      </div>
    </div>
    <div className='sidebar-content'>
      <RaisedButton
        secondary
        label='Post'
        labelPosition='after'>
        <FontIcon className='material-icons new-post-icon add-icon' color='white'>
           add
        </FontIcon>
      </RaisedButton>
      <ul className='navigation-links'>
        <li>
          <div className='flex-row'>
            <FontIcon className='material-icons nav-link-icon' color='black'>
               view_headline
            </FontIcon>
            <NavLink to='#' className='grey-link'>My Feed</NavLink>
          </div>
        </li>
        <li>
          <div className='flex-row'>
            <FontIcon className='material-icons nav-link-icon' color='black'>
               view_headline
            </FontIcon>
            <NavLink to='#' className='grey-link'>All Posts</NavLink>
          </div>
        </li>
      </ul>
      <TopicsList topics={topics}/>
      <DirectMessagesList contacts={contacts}/>
    </div>
  </div>
)

const AmaGuest = ({guest, type}) => {
  const capitalize = (s) => {
    return s.toUpperCase()
  }
  return (
    <div className='guest-row'>
      <div className='flex-row' style={{width: '90%', height: '100%'}}>
        <div className='date-outside-box'>
          {type === 'Wanted'
            ? <div className='votes-box'>
              <FontIcon className='material-icons vote-arrow-up-icon' color='black'>
                 arrow_drop_up
              </FontIcon>
              <span>{guest.votes}</span>
            </div>
          : null}
          {type === 'Upcoming' || type === 'Past'
            ? <div className='date-box'>
              <span className='date'>
                {capitalize(guest.date)}
                <br/>
                {capitalize(guest.time)}
              </span>
            </div>
          : null}
        </div>
        <div className='guest-info'>
          <div className='guest-avatar-box'>
            <Avatar src={guest.avatarUrl} size={100} className='guest-avatar'/>
          </div>
          <div className='flex-column'>
            <b>{guest.name + ' \'' + guest.classYear}</b>
            <span className='guest-description'>{guest.description}</span>
            <div className='flex-row'>
              {type === 'Wanted'
                ? [
                  guest.submittedTime !== undefined ? <span className='guest-submitted-time'>{'Submitted at ' + guest.submittedTime}</span> : null,
                  guest.submittedUser !== undefined && guest.submittedUser.avatarUrl !== undefined
                    ? <Avatar src={guest.submittedUser.avatarUrl} size={25} className='guest-submitted-user-avatar'/>
                  : null
                ]
              : null}
              {type === 'Upcoming'
                ? [
                  guest.remind === 'true' ? <span className='guest-remind'>Remind Me</span> : null,
                  guest.attending !== undefined ? <span className='guest-attending'>{guest.attending + ' ATTENDING'}</span> : null
                ]
              : null}
              {type === 'Past'
                ? [
                  guest.attending !== undefined ? <span className='guest-attending'>{guest.attending + ' ATTENDED'}</span> : null
                ]
              : null}
            </div>
          </div>
        </div>
      </div>
      <div className='flex'>
        {guest.commentsNum !== undefined
          ? <div className='flex-row' style={{marginTop: '30px'}}>
            <img src='/images/chat-bubble.svg' className='comments-icon'/>
            <span className='guest-comment-num'>{guest.commentsNum}</span>
          </div>
        : null}
      </div>
    </div>
  )
}

const AmaGuestList = ({guests, type}) => {
  return (
    <div className='guest-list'>
      {guests.map((guest) =>
        <AmaGuest guest={guest} type={type}/>
      )}
    </div>
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
      <div className='main'>
        <div className='flex-row'>
          <Sidebar user={this.props.user} topics={this.props.topics} contacts={this.props.contacts}/>
          <div className='content'>
            <h3 className='content-header'>#AMA &nbsp; Ask Me Anything</h3>
            <div className='ama-list'>
              <div className='tab-header'>
                <span className='tab-link-box'>
                  <a href='#'
                    className={this.state.tab === 'Wanted' ? 'tab-selected-link' : 'tab-link'}
                    onClick={this.tabItemClicked}>
                    Wanted
                  </a>
                </span>
                <span className='tab-link-middle-box'>
                  <a href='#'
                    className={this.state.tab === 'Upcoming' ? 'tab-selected-link' : 'tab-link'}
                    onClick={this.tabItemClicked}>
                    Upcoming
                  </a>
                </span>
                <span className='tab-link-box'>
                  <a href='#'
                    className={this.state.tab === 'Past' ? 'tab-selected-link' : 'tab-link'}
                    onClick={this.tabItemClicked}>
                    Past
                  </a>
                </span>
              </div>
              {this.state.tab === 'Wanted'
                ? [
                  <div className='flex-column' style={{flexShrink: 0}}>
                    <span className='vote-for-text'>
                      Vote for the tiger you want to hear from the most. If there is someone you'd love to hear
                      but not on this list, you can
                    </span>
                    <div className='suggest-new-ama'>
                      <FontIcon className='material-icons suggest-new-ama-icon' color='#CCCCCC'>
                         add
                      </FontIcon>
                      <span>Suggest New AMA</span>
                    </div>
                  </div>,
                  <AmaGuestList guests={this.props.guests.wanted} type='Wanted' />
                ]
              : null}
              {this.state.tab === 'Upcoming'
                ? <AmaGuestList guests={this.props.guests.upcoming} type='Upcoming' />
              : null}
              {this.state.tab === 'Past'
                ? <AmaGuestList guests={this.props.guests.past} type='Past' />
              : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
})
