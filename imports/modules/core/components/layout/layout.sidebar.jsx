import React from 'react'
import {Flex} from 'jsxstyle'
import LeftNav from 'material-ui/lib/left-nav'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import FlatButton from 'material-ui/lib/flat-button'
import SidebarOverlay from '/imports/modules/core/components/onboarding/sidebar.overlay.jsx'
import {SmallListItem, MediumListItem, LetterAvatar, CoverAvatar} from '/imports/modules/core/components/helpers.jsx'
import RaisedButton from 'material-ui/lib/raised-button'
import FontIcon from 'material-ui/lib/font-icon'
import { i18n } from '/client/config/env'

const theme = i18n('secondaryMuiTheme')
const accent1Color = theme.baseTheme.palette.accent1Color
const primary3Color = theme.baseTheme.palette.primary3Color

const SidebarHeader = (props) => {
  return (
    <ListItem id='sidebar-header'
      innerDivStyle={{
        paddingTop: 8,
        paddingRight: 8,
        paddingBottom: 8,
        paddingLeft: 8
      }} onTouchTap={props.onTapSettings}>
      <Flex>
        {props.user.avatar.isDefaultAvatar
          ? <LetterAvatar
            color='white'
            backgroundColor={props.user.avatar.color}
            size={60}>
              {props.user.avatarInitials}
          </LetterAvatar>
          : <CoverAvatar src={props.user.avatar.url} size={60} />
        }
        <Flex
          flexGrow={1}
          marginLeft={8}
          flexDirection='column'
          justifyContent='space-around'>
          <h3 style={Object.assign({}, { color: accent1Color })}>
            {i18n('title')}
          </h3>
          <Flex alignItems='center' style={{ overflow: 'hidden' }}>
            <span style={{ width: 120, lineHeight: '24px', textOverflow: 'ellipsis',
              overflow: 'hidden'}}>
              {props.user.shortDisplayName}
            </span>
            <FontIcon className='material-icons' style={{marginLeft: 'auto'}}>expand_more</FontIcon>
          </Flex>
        </Flex>
      </Flex>
    </ListItem>
  )
}

const SubHeader = ({label, action, onClick}) => (
  <FlatButton style={{ width: '100%', paddingLeft: 4, paddingRight: 16, color: primary3Color,
      fontWeight: 'normal'
    }} onTouchTap={onClick}>
    <Flex justifyContent='space-between'>
      <span>{label}</span>
      <span>{action}</span>
    </Flex>
  </FlatButton>
)

const AddNewPostButton = ({ onClick }) => (
  <Flex marginTop='15' marginBottom='7'>
    <RaisedButton primary label='New Post' labelPosition='after' onTouchTap={onClick}
      style={{margin: '0px auto'}}>
      <FontIcon className='material-icons' color='white'
        style={{
          verticalAlign: 'middle',
          height: '100%',
          marginLeft: 8
        }}>
         add_circle
      </FontIcon>
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
    currentRouterPath: React.PropTypes.string.isRequired,
    showOverlay: React.PropTypes.bool.isRequired,
    sidebarOpen: React.PropTypes.bool.isRequired,
    onTapSettings: React.PropTypes.func.isRequired,
    showAllTopics: React.PropTypes.func.isRequired
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext () {
    return {
      muiTheme: theme
    }
  },

  giveListItemStyleForRoutePath (routeName) {
    return (`/${routeName}` === this.props.currentRouterPath) ? {
      backgroundColor: primary3Color
    } : {}
  },

  render () {
    if (this.props.showOverlay) {
      return (
        <LeftNav
          open={this.props.sidebarOpen}
          style={{display: 'flex', flexDirection: 'column'}}
          width={240} >
          <SidebarOverlay />
        </LeftNav>
      )
    }

    return (
      <LeftNav open={this.props.sidebarOpen} width={240} style={
          Object.assign({}, {display: 'flex', flexDirection: 'column'})}>
        <SidebarHeader user={this.props.user} onTapSettings={this.props.onTapSettings} />
        <AddNewPostButton onClick={this.props.showAddPostPopupFn}/>
        <nav className='no-scrollbar' style={{flexGrow: 1, overflow: 'scroll'}}>
          <List>
            <MediumListItem
              style={this.giveListItemStyleForRoutePath('all-mine')}
              onTouchTap={this.props.navigateTo.bind({ location: 'all-mine' })}>
                My Feed
            </MediumListItem>

            <MediumListItem
              style={this.giveListItemStyleForRoutePath('all')}
              onTouchTap={this.props.navigateTo.bind({ location: 'all' })}>
                All Posts
            </MediumListItem>
          </List>
          <List subheader={
            <SubHeader label='TOPICS' action='ALL' onClick={this.props.showAllTopics}/>
          }>
            {this.props.followedTopics.map((topic) =>
              <SmallListItem
                key={topic._id}
                style={this.giveListItemStyleForRoutePath(`topics/${topic._id}`)}
                onTouchTap={() => { this.props.showTopic(topic._id) }}>
                    # {topic.displayName}
              </SmallListItem>
            )}
          </List>
        </nav>
      </LeftNav>
    )
  }
})
