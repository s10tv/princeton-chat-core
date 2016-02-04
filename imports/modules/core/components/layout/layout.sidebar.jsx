import React from 'react'
import {Flex} from 'jsxstyle'
import LeftNav from 'material-ui/lib/left-nav'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import Divider from 'material-ui/lib/divider'
import FlatButton from 'material-ui/lib/flat-button'
import SidebarOverlay from '/imports/modules/core/components/onboarding/sidebar.overlay.jsx'
import {SmallListItem, MediumListItem, SquareAvatar, secondaryMuiTheme} from '/imports/modules/core/components/helpers.jsx'
import RaisedButton from 'material-ui/lib/raised-button'
import FontIcon from 'material-ui/lib/font-icon'

const SidebarHeader = (props) => {
  return (
    <ListItem id='sidebar-header' innerDivStyle={{
        paddingTop: 8,
        paddingRight: 8,
        paddingBottom: 8,
        paddingLeft: 8,
      }} onTouchTap={props.onTapSettings}>
      <Flex>
        <SquareAvatar src={ props.user.avatar.url } length={60} />
        <Flex flexGrow={1} marginLeft={8} flexDirection='column' justifyContent='space-around'>
          <h3>Princeton.Chat</h3>
          <Flex alignItems='center'>
            <span className='online-status' />
            <span>{ props.user.displayUsername }</span>
            <FontIcon className='material-icons' style={{marginLeft: 'auto'}}>expand_more</FontIcon>
          </Flex>
        </Flex>
      </Flex>
    </ListItem>
  )
}

const DirectMessageList = (props) => (
  <List subheader={<SubHeader label='DIRECT MESSAGES' action='ALL' />}>
    {this.props.directMessages.map(directMessage =>
      <SmallListItem key={directMessage._id}>{directMessage.displayName}</SmallListItem>
    )}
  </List>
)

const SubHeader = ({label, action, onClick}) => (
  <FlatButton style={{
      width: '100%',
      paddingLeft: 4,
      paddingRight: 16,
      color: 'gray',
      fontWeight: 'normal',
    }} onTouchTap={onClick}>
    <Flex justifyContent='space-between'>
      <span>{label}</span>
      <span>{action}</span>
    </Flex>
  </FlatButton>
)

const AddNewPostButton = ({ onClick }) => (
  <Flex marginTop='15' marginBottom='7' alignItems='center'>
    <RaisedButton
        primary={true}
        label="New Post"
        labelPosition='after'
        onTouchTap={onClick}>
      <FontIcon className='material-icons' color='white' style={{
          verticalAlign: 'middle',
          height: '100%',
          marginLeft: 8,
         }}>add_circle</FontIcon>
    </RaisedButton>
  </Flex>
)

export default React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired,
    followedTopics: React.PropTypes.array.isRequired,
    showTopic: React.PropTypes.func.isRequired,
    navigateTo: React.PropTypes.func.isRequired,
    showAddPostPopupFn: React.PropTypes.func.isRequired,
  },
  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },
  getChildContext() {
    return {
      muiTheme: secondaryMuiTheme,
    }
  },
  giveListItemStyleForRoutePath(routeName) {
    return (`/${routeName}` === FlowRouter.current().path) ? {backgroundColor: 'grey'} : {}
  },
  render() {
    if (this.props.showOverlay) {
      return (
        <LeftNav open={this.props.sidebarOpen} style={{display: 'flex', flexDirection: 'column'}} width={240} >
          <SidebarOverlay />
        </LeftNav>
      )
    }

    return (
      <LeftNav open={this.props.sidebarOpen} style={{display: 'flex', flexDirection: 'column'}} width={240} >
        <SidebarHeader user={this.props.user} onTapSettings={this.props.onTapSettings} />
        <Flex padding='8px 16px 0 16px'>
          <RaisedButton primary={true}
            label='New Post'
            onTouchTap={this.props.showAddPostPopupFn} />
        </Flex>
        <nav style={{flexGrow: 1, overflow: 'scroll'}}>
          <List>
            <MediumListItem style={this.giveListItemStyleForRoutePath('all-mine')} onTouchTap={this.props.navigateTo.bind({ location: 'all-mine' })}>My Feed</MediumListItem>
            <MediumListItem style={this.giveListItemStyleForRoutePath('all')} onTouchTap={this.props.navigateTo.bind({ location: 'all' })}>All Posts</MediumListItem>
          </List>
          <List subheader={<SubHeader label='TOPICS' action='ALL' onClick={this.props.showAllTopics}/>}>
            {this.props.followedTopics.map((topic) =>
              <SmallListItem style={this.giveListItemStyleForRoutePath(`topics/${topic._id}`)}key={topic._id} onTouchTap={this.props.showTopic.bind({ topic })}>
                # {topic.displayName}
              </SmallListItem>
            )}
          </List>
        </nav>
      </LeftNav>
    )
  }
})
