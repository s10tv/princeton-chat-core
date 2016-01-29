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
    followersCount: React.PropTypes.string,

    /**
     * True if the followers section should be hidden
     */
    hideFollowerSection: React.PropTypes.bool,

    /**
     * True if the Follow/Following action section will be hidden
     */
     hideFollowActionSection: React.PropTypes.bool,

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
      * Executing this function shows the post modal.
      */
     showAddPostPopupFn: React.PropTypes.func,
  },

  render() {
    if (this.props.hidden) {
      return null;
    }

    return (
      <Toolbar style={{backgroundColor: 'white', borderBottom: '1px solid #ddd'}}>

        { !this.props.isMobile ? null :
          <ToolbarGroup firstChild={true}>
            <IconButton iconClassName='material-icons' tooltip='Menu'>menu</IconButton>
          </ToolbarGroup>
        }

        { this.props.hideTitleSection ? null :
          <ToolbarGroup >
            <ToolbarTitle text={this.props.title} />
          </ToolbarGroup>
        }

        { this.props.hideFollowerSection ? null :
          <ToolbarGroup style={{height: '100%'}}>
            <Flex alignItems='center' height='100%'>
              <FontIcon className='material-icons'>group</FontIcon>
              <span>{ this.props.followersCount }</span>
            </Flex>
          </ToolbarGroup>
        }

        { this.props.hideFollowActionSection ? null :
          <ToolbarGroup>
            { this.props.isFollowing
              ? <FlatButton
                  label='Following'
                  style={{ backgroundColor: '#4CAF50', color: '#ffffff' }}
                  onTouchTap={this.props.unfollowFn} />
              : <FlatButton
                  label='Follow'
                  onTouchTap={this.props.followFn} />
            }
          </ToolbarGroup>
        }

        { this.props.hidePostButton ? null :
          <ToolbarGroup float='right' lastChild={true}>
            <ToolbarSeparator />
            <RaisedButton primary={true}
                label='New Post'
                labelPosition='after'
                onTouchTap={this.props.showAddPostPopupFn}>
              <FontIcon className='material-icons' color='white' style={{
                  verticalAlign: 'middle',
                  height: '100%',
                  marginLeft: 8,
                 }}>add_circle</FontIcon>
            </RaisedButton>
          </ToolbarGroup>
        }

      </Toolbar>
    )
  }
})
