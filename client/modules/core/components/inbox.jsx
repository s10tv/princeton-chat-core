import React from 'react'
import {Flex as _Flex} from 'jsxstyle'
import IconButton from 'material-ui/lib/icon-button'
import FontIcon from 'material-ui/lib/font-icon'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import Menu from '/client/modules/core/components/menu.jsx'
import styles from '/client/modules/core/components/styles.jsx'
import { UserAvatar } from '/client/modules/core/components/helpers.jsx'
import color from '/client/configs/color'
import {Paper} from '/client/lib/ui.jsx'
import Radium from 'radium'
const Flex = Radium(_Flex)
const Inbox = React.createClass({
  propTypes: {

    /**
     * True if there are no posts in this list
     */
    isEmpty: React.PropTypes.bool,

    /**
     * Boolean to show/hide sidebar
     */
    sidebarOpen: React.PropTypes.bool.isRequired,

    /**
     * The function archives the notification item
     */
    archiveInboxItem: React.PropTypes.func.isRequired
  },

  render () {
    return (
      <main style={Object.assign({}, styles.main, {
        marginLeft: this.props.sidebarOpen ? 240 : 0,
        backgroundColor: color.inbox.backgroundGray
      })}>
        <Flex flexDirection='column' flexGrow={1}>
          <Menu
            style={{
              marginBottom: 40
            }}
            {...this.props} />
          <Paper style={{
            display: 'flex',
            alignSelf: 'center',
            maxWidth: 750
          }}>
            {this.props.isEmpty
              ? <EmptyScreen {...this.props} />
              : <InboxResults {...this.props} />}
          </Paper>
        </Flex>
      </main>
    )
  }
})

const EmptyScreen = () => (
  <Flex marginTop={50} flexGrow={1} flexDirection='column' justifyContent='center' alignItems='center'>
    <FontIcon style={{fontSize: 50}} className='material-icons'>search</FontIcon>
    <h2 style={{fontWeight: 500}}>
      Your inbox is empty.
    </h2>
  </Flex>
)

const InboxResults = (props) => (
  <section className='post-list' style={{flexGrow: 1, overflowX: 'hidden'}}>
    <List style={{paddingTop: 0, paddingBottom: 0}}>
      {props.notifications.map((notification) =>
        <NotificationListItem key={notification._id} notification={notification} {...props} />
      )}
    </List>
  </section>
)

const NotificationListItem = ({notification, archiveInboxItem}) => (
  <ListItem
    disabled
    style={s.notificationListItem}>
    <Flex style={s.notificationListItemMainFlex}>
      <Flex style={s.notificationTypeContainer}>
        <Flex style={s.notificationTypeIcon(notificationTypeUrl(notification.reason))} />
      </Flex>
      <Flex style={s.notificationContentContainer}>
        <Flex>
          {notification.topics.map((topic) => <span key={topic._id} style={s.notificationTopicItem}>
            #{topic.displayName}
          </span>)}
        </Flex>
        <h2 style={s.notificationTitle}>{notification.title}</h2>
        {notification.reason === 'newpost'
          ? <MessageItem message={notification} />
          : null}
        {notification.reason === 'reply'
          ? notification.messages.map((message) =>
            <MessageItem key={message._id} message={message} />)
          : null
        }
      </Flex>
      <Flex style={s.notificationArchiveContainer}>
        <IconButton tooltip='Archive'
          onTouchTap={() => archiveInboxItem(notification.notificationId)}
          iconStyle={s.archiveBtn}>
          <FontIcon className='material-icons'>
            clear
          </FontIcon>
        </IconButton>
      </Flex>
    </Flex>
  </ListItem>
)

const MessageItem = ({ message }) => (
  <Flex>
    <UserAvatar avatar={message.owner.avatar} avatarInitials={message.owner.avatarInitials}
      style={{flexShrink: 0}} />
    <Flex flexDirection='column' style={s.messageContentContainer}>
      <Flex>
        <span style={s.messageAuthor}>{message.owner.displayName}</span>
        <span style={s.messageTimestamp}>{message.timestamp}</span>
      </Flex>
      <p style={s.messageContent}>{message.truncatedContent}</p>
    </Flex>
  </Flex>
)

const notificationTypeUrl = (type) => {
  switch (type) {
    case 'newpost':
      return 'ic-newpost.svg'
    case 'reply':
      return 'ic-reply.svg'
  }
}

const s = {
  searchResult: {
    lineHeight: '24px'
  },
  subTitle: {
    color: color.gray,
    fontSize: 14,
    marginRight: 5
  },
  postContent: {
    marginLeft: 5
  },
  archiveBtn: {
    color: color.gray
  },
  lastMessage: {
    marginTop: 10
  },
  notificationTopicItem: {
    marginRight: 10,
    color: color.lightGray,
    fontWeight: 300
  },
  notificationTitle: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
    lineHeight: '1em'
  },
  notificationListItem: {
    borderBottom: `1px solid ${color.inbox.separatorGray}`,
    padding: 0,
    ':hover': {
      backgroundColor: color.inbox.hoverGray
    }
  },
  notificationTypeContainer: {
    flexGrow: 1,
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
    maxWidth: 50,
    borderRight: `1px solid ${color.inbox.separatorGray}`
  },
  notificationTypeIcon: (url) => ({
    width: 30,
    height: 30,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url(/images/${url})`
  }),
  notificationContentContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    padding: 15
  },
  notificationArchiveContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
    maxWidth: 70,
    ':hover': {
      backgroundColor: color.inbox.archiveBoxGray
    }
  },
  notificationListItemMainFlex: {
    ':hover': {
      backgroundColor: color.inbox.hoverGray
    }
  },
  messageContentContainer: {
    marginLeft: 12
  },
  messageTimestamp: {
    fontWeight: 300,
    marginLeft: 12,
    color: color.inbox.archiveIconGray
  },
  messageAuthor: {
    fontSize: 15
  },
  messageContent: {
    marginTop: 10
  }
}

export default Radium(Inbox)
