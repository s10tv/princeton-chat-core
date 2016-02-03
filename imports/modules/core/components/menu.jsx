import React from 'react'
import {Flex} from 'jsxstyle'
import Toolbar from 'material-ui/lib/toolbar/toolbar'
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group'
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator'
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title'
import IconButton from 'material-ui/lib/icon-button'
import FontIcon from 'material-ui/lib/font-icon'
import FlatButton from 'material-ui/lib/flat-button'
import RaisedButton from 'material-ui/lib/raised-button'
import truncate from 'truncate'

export default React.createClass({

  propTypes: {
    /**
     * True if the menu should be mobile optimized.
     */
    isMobile: React.PropTypes.bool,

    /**
     * True if the menu should be hidden.
     */
    hidden: React.PropTypes.bool,

    /**
     * The title bar of the menu (i.e. breadcrumb info or DM username)
     */
    title: React.PropTypes.string,

    /**
     * True if the title section should be hidden
     */
    hideTitleSection: React.PropTypes.bool,

    /**
     * This text will be prepended with a person avatar.
     */
    followersCount: React.PropTypes.number,

    /**
     * True if the followers section should be hidden
     */
    hideFollowerSection: React.PropTypes.bool,

    /**
     * Shows who is following this topic
     */
    showFollowersFn: React.PropTypes.func,

    /**
     * True if the Follow/Following action section will be hidden
     */
    hideFollowActionSection: React.PropTypes.bool,

    /**
     * True if the Importing new users action button will be hidden
     */
    hideAddNewUsersButton: React.PropTypes.bool,

    /**
    * True if this element is already being followed.
    */
    isFollowing: React.PropTypes.bool,

    /**
    * Functions to call when follow action is pressed.
    */
    followFn: React.PropTypes.func,
    unfollowFn: React.PropTypes.func,

    /**
    * True to hide the add new post button
    */
    hidePostButton: React.PropTypes.bool,

    /**
    * Executing this function shows the import new users modal.
    */
    showAddNewUsersModal: React.PropTypes.func,

    /**
     * For media queries
     */
    isAtLastTablet: React.PropTypes.bool,
    isAtLastDesktop: React.PropTypes.bool,
  },

  getTitleText() {
    if (this.props.isAtLastTablet) {
      return truncate(this.props.title, 50);
    } else if (this.props.isAtLastTablet)  {
      return truncate(this.props.title, 30);
    } else {
      return ''; // mobile devices are too small to display titles.
    }
  },

  getAddPostButtonText() {
    if (this.props.isDesktop || this.props.isTablet) {
      return 'New Post';
    }

    return 'Post';
  },

  getFollowerButton() {
    const emailIcon = this.props.sidebarOpen ? null :
      <FontIcon className='material-icons' color='white' style={{
        verticalAlign: 'middle',
        height: '100%',
        marginLeft: (this.props.sidebarOpen ? 8 : 0),
      }}>email</FontIcon>

    if (this.props.isFollowing) {
      return <FlatButton
        label={ this.props.sidebarOpen ? 'Following' : null }
        style={{
          backgroundColor: '#4CAF50',
          color: '#ffffff'
        }}
        onTouchTap={this.props.unfollowFn}>
          { emailIcon }
      </FlatButton>
    } else {
      return <FlatButton
        label={ this.props.sidebarOpen ? 'Follow' : null }
        style={{
          backgroundColor: '#cccccc',
          color: '#ffffff'
        }}
        onTouchTap={this.props.followFn}>
          { emailIcon }
      </FlatButton>
    }
  },

  render() {
    if (this.props.hidden) {
      return null;
    }

    return (
      <Toolbar style={{backgroundColor: 'white', borderBottom: '1px solid #ddd', zIndex: 1000}}>

        { this.props.sidebarOpen ? null :
          <ToolbarGroup firstChild={true}>
            <IconButton iconClassName='material-icons' tooltip='Menu' onTouchTap={() => {
                console.log('clicked menu');
              }}>menu</IconButton>
          </ToolbarGroup>
        }

        { this.props.hideTitleSection ? null :
          <ToolbarGroup >
            <a className='topic-header-link-button' href='#' onClick={this.props.showFollowersFn}>
              <ToolbarTitle text={this.getTitleText()} />
            </a>
          </ToolbarGroup>
        }

        { this.props.hideFollowerSection ? null :
          <ToolbarGroup style={{height: '100%'}}>
            <Flex alignItems='center' height='100%'>
              <a className='topic-header-link-button' href='#' onClick={this.props.showFollowersFn} style={{display: 'flex', alignItems: 'center'}}>
                <FontIcon className='material-icons' tooltip='Followers'>group</FontIcon>
                <span style={{marginLeft: 5}}>{ this.props.followersCount }</span>
              </a>
            </Flex>
          </ToolbarGroup>
        }

        { this.props.hideFollowActionSection ? null :
          <ToolbarGroup>
            { this.getFollowerButton() }
          </ToolbarGroup>
        }

        { this.props.hideAddNewUsersButton ? null :
          <ToolbarGroup float='right' style={{marginRight: -24}}>
            <RaisedButton
              primary={true}
              label='Add New Users'
              onTouchTap={() => this.props.showAddNewUsersModal(this.props.topic._id)} />
          </ToolbarGroup>
        }
      </Toolbar>
    )
  }
})
