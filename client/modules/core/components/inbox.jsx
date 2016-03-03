import React from 'react'
import {Flex} from 'jsxstyle'
import IconButton from 'material-ui/lib/icon-button'
import FontIcon from 'material-ui/lib/font-icon'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import Menu from '/client/modules/core/components/menu.jsx'
import styles from '/client/modules/core/components/styles.jsx'
import { LetterAvatar, CoverAvatar } from '/client/modules/core/components/helpers.jsx'
import color from '/client/configs/color'

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
  }
}

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
        marginLeft: this.props.sidebarOpen ? 240 : 0
      })}>
        <Flex flexDirection='column' flexGrow={1}>
          <Menu
            style={{
              marginBottom: 20
            }}
            {...this.props} />
          <Flex>
            {this.props.isEmpty
              ? <EmptyScreen {...this.props} />
              : <InboxResults {...this.props} />}
          </Flex>
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
    <List style={{paddingTop: 0, paddingBottom: 0, paddingLeft: 10}}>
      {props.notifications.map((notification) =>
        <PostListItem key={notification._id} notification={notification} {...props} />
      )}
    </List>
  </section>
)

const PostListItem = ({notification, archiveInboxItem}) => (
  <ListItem
    disabled
    style={{
      borderBottom: '1px solid #e0e0e0',
      padding: 10
    }}>
    <Flex flexDirection='column'>
      <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
        <Flex alignItems='center'>
          <a href={notification.url} style={{color: 'black'}}>
            <h2 style={s.postTitle}>{notification.title}</h2>
          </a>
        </Flex>
        <Flex flexShrink={0} marginRight={16} alignItems='center'>
          <IconButton tooltip='Archive'
            onTouchTap={() => archiveInboxItem(notification.notificationId)}
            iconStyle={s.archiveBtn}>
            <FontIcon className='material-icons'>
              clear
            </FontIcon>
          </IconButton>
        </Flex>
      </Flex>
      {!notification.showPostDetails ? null
        : <Flex alignItems='center'>
          <UserAvatar user={notification.owner}/>
          <p style={s.postContent}>{notification.truncatedContent}</p>
        </Flex>
      }
      {notification.messages.map((message) => (
        <Flex alignItems='center' style={s.lastMessage}>
          <UserAvatar user={message.owner}/>
          <p style={s.postContent}>{message.content}</p>
        </Flex>
      ))}
    </Flex>
  </ListItem>
)

export const UserAvatar = (props) => (
  props.user.avatar.isDefaultAvatar
    ? <LetterAvatar size={30} color='white'
      backgroundColor={props.user.avatar.color}>
      {props.user.avatarInitials}
    </LetterAvatar>
    : <CoverAvatar size={30} src={props.user.avatar.url} />
)

export default Inbox
