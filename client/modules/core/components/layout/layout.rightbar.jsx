import React from 'react'
import {Flex} from 'jsxstyle'
import List from '../../../../../node_modules/material-ui/lib/lists/list'
import ListItem from '../../../../../node_modules/material-ui/lib/lists/list-item'
import FontIcon from '../../../../../node_modules/material-ui/lib/font-icon'
import Badge from '../../../../../node_modules/material-ui/lib/badge'
import * as Colors from 'material-ui/lib/styles/colors'
import IconButton from '../../../../../node_modules/material-ui/lib/icon-button'
import MoreVertIcon from '../../../../../node_modules/material-ui/lib/svg-icons/navigation/more-vert'
import IconMenu from '../../../../../node_modules/material-ui/lib/menus/icon-menu'
import MenuItem from '../../../../../node_modules/material-ui/lib/menus/menu-item'
import { i18n } from '/client/configs/env'
import {UserAvatar} from '/client/modules/core/components/helpers.jsx'
import {FlatButton, Dialog} from '/client/lib/ui.jsx'
import Radium from 'radium'

const theme = i18n('primaryMuiTheme')
const accent1Color = theme.baseTheme.palette.accent1Color

const RightBar = React.createClass({
  propTypes: {
    // FOR POST LIST SCREEN
    /**
     * Topic to render
     */
    topic: React.PropTypes.object,

    /**
     * Posts to render (array can be empty).
     */
    posts: React.PropTypes.array,

    /**
     * Current user viewing the list
     */
    isTopicAdmin: React.PropTypes.bool.isRequired,

    /**
     * A function to show the followers of the post.
     */
    showPostFollowers: React.PropTypes.func,

    /**
     * Func to show topic followers modal from already fetched follower list
     */
    updateAndShowFollowersModal: React.PropTypes.func,

    /**
     * Func to remove the topic.
     */
    removeTopic: React.PropTypes.func.isRequired,
    isMyTopic: React.PropTypes.bool.isRequired,
    isRightSidebarOpen: React.PropTypes.bool.isRequired
  },

  getInitialState () {
    return {
      isOpen: false
    }
  },

  openConfirmation () {
    this.setState({
      isOpen: true
    })
  },

  closeConfirmation () {
    this.setState({
      isOpen: false
    })
  },

  render () {
    const props = this.props

    // right bar is closed for small devices
    if (!props.isRightSidebarOpen) {
      return null
    }

    return (
      <Flex width={320} minWidth={320} className='no-scrollbar'
        style={{
          flexDirection: 'column',
          padding: '0px 20px',
          paddingBottom: '15px',
          overflowY: 'scroll',
          overflowX: 'hidden'
        }}>
        <h3 style={{fontWeight: 400, marginTop: 10, marginBottom: 0, flexShrink: 0}}>About #{props.topic.displayName}</h3>
        <p style={{fontWeight: 300, marginTop: 10, marginBottom: 0, flexShrink: 0}}>
          {props.topic.description}
        </p>

        <h4 style={{fontWeight: 400, marginTop: 35, marginBottom: 0, flexShrink: 0}}>Channel Address</h4>
        <a style={{fontWeight: 300, marginTop: 10, marginBottom: 0, flexShrink: 0}}
          href={`mailto:${props.topic._id}@${i18n('topicMailServer')}`} target='_blank'>
          {`${props.topic._id}@${i18n('topicMailServer')}`}
        </a>
        <p style={{fontWeight: 300, color: '#d3d4d7', marginTop: 10, flexShrink: 0}}>
          Emailing to this address will create a post and notify everyone subscribed to the channel.
        </p>

        <Flex justifyContent='space-between' alignItems='center' minHeight={36} marginTop={15}>
          <h4 style={{fontWeight: 400, marginTop: 0, marginBottom: 0}}>
            <a href='#' style={{}}
              onClick={
                () => props.updateAndShowFollowersModal(props.topic.followersList)
              }>
              Subscribers ({props.topic.followers.length})
            </a>
          </h4>
          <FlatButton
            primary
            onTouchTap={() => props.navigateToAddFollowers(props.topic._id)}
            label='Add'
          />
        </Flex>

        <List style={{marginTop: 5, marginBottom: 0, paddingTop: 0, paddingBottom: 0}}>
          {props.topic.followersList.map((f) =>
            <FollowerListItem key={f._id} follower={f}
              isTopicAdmin={this.props.isTopicAdmin}
              removeFollower={() => props.removeFollower(props.topic._id, f._id)}
              showUserProfile={props.showUserProfile} />
          )}
        </List>

        {!this.props.isMyTopic
          ? null
          : <div>
            <FlatButton
              label='Remove Topic'
              labelPosition='after'
              icon={<FontIcon className='material-icons'>remove</FontIcon>}
              onTouchTap={this.openConfirmation}
              style={{width: '100%', marginTop: 10, color: '#E0E0E0'}}/>

            <Dialog
              title={'Are you sure?'}
              modal={false}
              open={this.state.isOpen}
              actions={[
                <FlatButton
                  label='Cancel'
                  style={{ color: '#E0E0E0' }}
                  onTouchTap={this.closeConfirmation} />,
                <FlatButton
                  label='Delete'
                  style={{ color: '#F44336' }}
                  onTouchTap={() => this.props.removeTopic(props.topic._id)} />
              ]}
              onRequestClose={this.closeConfirmation}>
              <p>
                Removing a topic cannot be undone. Users who have already gotten post emails
                will not be able to view this topic.
              </p>
            </Dialog>
          </div>
        }
      </Flex>
    )
  }
})

var FollowerListItem = ({follower, showUserProfile, removeFollower, currentUser, isTopicAdmin}) => (
  <ListItem disabled style={{padding: '15px 0px'}} rightIconButton={
    !isTopicAdmin ? null : (
      <IconMenu iconButtonElement={
        <IconButton
          touch
          tooltip='more'
          tooltipPosition='bottom-left'>
          <MoreVertIcon color={Colors.grey400} />
        </IconButton>
      }>
        <MenuItem style={{color: 'red'}} onTouchTap={removeFollower}>Remove follower</MenuItem>
      </IconMenu>)
    }>
    <a href='#' onClick={() => showUserProfile(follower)}>
      <Flex alignItems='center'>
        {follower.isFullMember
          ? <UserAvatar size={40} avatarInitials={follower.avatarInitials}
            avatar={follower.avatar} />
          : <Badge style={{padding: '15px 15px 0px 0px'}}
            badgeContent={
              <FontIcon className='material-icons' style={{fontSize: 20}}>language</FontIcon>
            }>
            <UserAvatar size={40} avatarInitials={follower.avatarInitials}
            avatar={follower.avatar} />
          </Badge>
        }
        <Flex flexDirection='column'
          style={Object.assign({}, follower.isFullMember && { marginLeft: 15 })}>
          {follower.displayName
            ? <span style={{fontWeight: 300}}>
              {follower.displayName}
            </span>
            : null
          }
          <span style={Object.assign({}, { marginTop: 15 }, {
            color: accent1Color,
            fontWeight: 300
          })}>
            {follower.displayEmail}
          </span>
        </Flex>
      </Flex>
    </a>
  </ListItem>
)

FollowerListItem = Radium(FollowerListItem)

export default Radium(RightBar)
