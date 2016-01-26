import React from 'react'
import {Flex} from 'jsxstyle'
import LeftNav from 'material-ui/lib/left-nav'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import Divider from 'material-ui/lib/divider'
import FlatButton from 'material-ui/lib/flat-button'
import {SmallListItem, MediumListItem, SquareAvatar, secondaryMuiTheme} from './helpers.jsx'

import FontIcon from 'material-ui/lib/font-icon'

const SidebarHeader = (props) => {
  return (
    <ListItem id='sidebar-header' innerDivStyle={{
        paddingTop: 8,
        paddingRight: 8,
        paddingBottom: 8,
        paddingLeft: 8,
      }}>
      <Flex>
        <SquareAvatar src={ props.user.avatar.url } length={60} />
        <Flex flexGrow={1} marginLeft={8} flexDirection='column' justifyContent='space-around'>
          <h3>Princeton.Chat</h3>
          <Flex alignItems='center'>
            <span className='online-status' />
            <span>@{ props.user.username }</span>
            <FontIcon className='material-icons' style={{marginLeft: 'auto'}}>expand_more</FontIcon>
          </Flex>
        </Flex>
      </Flex>
    </ListItem>
  )
}

const SubHeader = ({label, action}) => (
  <FlatButton style={{
      width: '100%',
      paddingLeft: 4,
      paddingRight: 16,
      color: 'gray',
      fontWeight: 'normal',
    }}>
    <Flex justifyContent='space-between'>
      <span>{label}</span>
      <span>{action}</span>
    </Flex>
  </FlatButton>
)

export default React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired,
    followedTopics: React.PropTypes.array.isRequired,
  },
  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },
  getChildContext() {
    return {
      muiTheme: secondaryMuiTheme,
    }
  },
  render() {
    return (
      <LeftNav open={this.props.sidebarOpen} style={{display: 'flex', flexDirection: 'column'}} width={240}>
        <SidebarHeader user={this.props.user} />
        <Divider />
        <nav style={{flexGrow: 1, overflow: 'scroll'}}>
          <List>
            <MediumListItem>Posts for me</MediumListItem>
            <MediumListItem>All Posts</MediumListItem>
            <MediumListItem>Housing</MediumListItem>
            <MediumListItem>Jobs</MediumListItem>
          </List>
          <List subheader={<SubHeader label='TOPICS' action='ALL' />}>
            {this.props.followedTopics.map((topic) =>
              <SmallListItem key={topic._id} onTouchTap={this.props.showTopic.bind({ topic })}>
                # {topic.displayName}
              </SmallListItem>
            )}
          </List>
          <List subheader={<SubHeader label='DIRECT MESSAGES' action='ALL' />}>
            {['tigercub', 'fang', 'nurym'].map((username) =>
              <SmallListItem key={username}>@ {username}</SmallListItem>
            )}
          </List>
        </nav>
      </LeftNav>
    )
  }
})
