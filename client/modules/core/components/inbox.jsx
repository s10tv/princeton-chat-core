import React from 'react'
import {Flex as _Flex} from 'jsxstyle'
import styles from '/client/modules/core/components/styles.jsx'
import { UserAvatar } from '/client/modules/core/components/helpers.jsx'
import color from '/client/configs/color'
import {Paper, IconButton, List, ListItem, FontIcon, MentionSvgIcon, ReplySvgIcon,
  NewPostSvgIcon} from '/client/lib/ui.jsx'
import Radium from 'radium'
import {InboxCoverPhoto} from '/client/lib/unsplash.service'

const Flex = Radium(_Flex)
const Inbox = React.createClass({
  propTypes: {

    /**
     * True if there are no posts in this list
     */
    isEmpty: React.PropTypes.bool,
    /**
     * The function archives the notification item
     */
    archiveInboxItem: React.PropTypes.func.isRequired,
    navigateToUrl: React.PropTypes.func.isRequired,
    showUserProfile: React.PropTypes.func.isRequired
  },

  render () {
    return (
      <main style={Object.assign({}, styles.main, {
        backgroundColor: color.inbox.backgroundGray
      })}>
        <Flex style={s.mainFlexContainer}>
          <h1 style={s.myInboxTitle}>My Inbox</h1>
          <Paper style={{
            display: 'flex',
            alignSelf: 'center',
            maxWidth: 750,
            minWidth: 500
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
  <section style={{flexGrow: 1, overflowX: 'hidden'}}>
    <List style={{paddingTop: 0, paddingBottom: 0}}>
      {props.notifications.map((notification) =>
        <NotificationListItem key={notification._id} notification={notification} {...props} />
      )}
    </List>
  </section>
)

const NotificationListItem = ({notification, archiveInboxItem, navigateToUrl, showUserProfile}) => (
  <ListItem
    disabled
    style={s.notificationListItem}>
    <Flex style={s.notificationListItemMainFlex} props={{
      onClick: (e) => {
        e.preventDefault()
        navigateToUrl(notification.url)
      }
    }}>
      <Flex style={s.notificationTypeContainer}>
        <IconButton tooltip={notification.reasonExtended} tooltipPosition='top-right'>
          {notificationTypeSvgIcon(notification.reason)}
        </IconButton>
      </Flex>
      <Flex style={s.notificationContentContainer}>
        <Flex>
          {notification.topics.map((topic) => <span key={topic._id} style={s.notificationTopicItem}>
            #{topic.displayName}
          </span>)}
        </Flex>
        <h2 style={s.notificationTitle}>{notification.title}</h2>
        {notification.reason === 'newpost'
          ? <MessageItem message={notification} showUserProfile={showUserProfile} />
          : null}
        {notification.reason === 'reply' || notification.reason === 'mention'
          ? notification.messages.map((message) =>
            <MessageItem key={message._id} message={message} showUserProfile={showUserProfile} />)
          : null
        }
      </Flex>
      <Flex style={s.notificationArchiveContainer} props={{
        onClick: (e) => {
          e.stopPropagation()
          archiveInboxItem(notification.notificationId)
        }
      }}>
        <IconButton tooltip='Archive'
          iconStyle={s.archiveBtn} tooltipPosition='top-center'>
          <FontIcon className='material-icons'>
            clear
          </FontIcon>
        </IconButton>
      </Flex>
    </Flex>
  </ListItem>
)

const MessageItem = ({ message, showUserProfile }) => (
  <Flex style={s.messageMainContainer}>
    <a href='#' onClick={(e) => {
      e.stopPropagation()
      showUserProfile(message.owner)
    }} style={{display: 'table'}}>
      <UserAvatar avatar={message.owner.avatar} avatarInitials={message.owner.avatarInitials}
        style={{flexShrink: 0}} />
    </a>
    <Flex flexDirection='column' style={s.messageContentContainer}>
      <Flex>
        <a href='#' onClick={(e) => {
          e.stopPropagation()
          showUserProfile(message.owner)
        }}>
          <span style={s.messageAuthor}>{message.owner.displayName}</span>
        </a>
        <span style={s.messageTimestamp}>{message.timestamp}</span>
      </Flex>
      <p style={s.messageContent}>{message.truncatedContent}</p>
    </Flex>
  </Flex>
)

const notificationTypeSvgIcon = (type) => {
  switch (type) {
    case 'newpost':
      return <NewPostSvgIcon />
    case 'reply':
      return <ReplySvgIcon />
    case 'mention':
      return <MentionSvgIcon />
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
  myInboxTitle: {
    fontWeight: 300,
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  mainFlexContainer: {
    flexDirection: 'column',
    flexGrow: 1,
    backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${InboxCoverPhoto.fullscreenUrl})`,
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    backgroundPosition: '0% 50%'
  },
  notificationTopicItem: {
    marginRight: 10,
    color: color.lightGray,
    fontWeight: 300
  },
  notificationTitle: {
    fontWeight: 400,
    marginTop: 10,
    marginBottom: 0,
    fontSize: 17,
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
    marginTop: 10,
    marginBottom: 0,
    fontWeight: 300,
    fontSize: 15
  },
  messageMainContainer: {
    marginTop: 20
  }
}

export default Radium(Inbox)
