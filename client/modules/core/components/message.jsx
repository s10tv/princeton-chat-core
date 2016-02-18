import React from 'react'
import {Block} from 'jsxstyle'
import Linkify from 'react-linkify'
import IconMenu from '../../../../node_modules/material-ui/lib/menus/icon-menu'
import MenuItem from '../../../../node_modules/material-ui/lib/menus/menu-item'
import IconButton from '../../../../node_modules/material-ui/lib/icon-button'
import MoreHorizIcon from '../../../../node_modules/material-ui/lib/svg-icons/navigation/more-horiz'
import { i18n } from '/client/configs/env'
import {LetterAvatar, CoverAvatar} from '/client/modules/core/components/helpers.jsx'

const theme = i18n('secondaryMuiTheme')
const accent1Color = theme.baseTheme.palette.accent1Color

export const Message = (props) => (
  <div className='message'>
    <div className='message-content'>
      <Linkify properties={{style: { color: accent1Color }}}>
        {props.content}
      </Linkify>
    </div>
    {props.action}
  </div>
)

export class MessageGroup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {hover: false, menuOpen: false}
  }
  render () {
    const props = this.props
    return (
      <div className='message-group'
        onMouseEnter={() => this.setState({hover: true})}
        onMouseLeave={() => this.setState({hover: false})}
        style={{
          position: 'relative',
          display: 'flex',
          padding: '8px 16px'
        }}>
        {(this.state.hover || this.state.menuOpen) && props.deleteMessage
          ? <IconMenu
            style={{position: 'absolute', top: 8, right: 8}}
            open={this.state.menuOpen}
            onRequestChange={(open) => { this.setState({menuOpen: open}) }}
            iconButtonElement={<IconButton><MoreHorizIcon /></IconButton>}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}>
            <MenuItem style={{color: 'red'}} primaryText='Delete message'
              onTouchTap={this.props.deleteMessage} />
          </IconMenu>
          : null
        }
        <a href='#' onClick={props.showUserProfile}>
          {props.owner.avatar.isDefaultAvatar
            ? <LetterAvatar
              size={50}
              color='white'
              backgroundColor={props.owner.avatar.color}>
              {props.owner.avatarInitials}
            </LetterAvatar>
            : <CoverAvatar size={50} src={props.owner.avatar.url} />
          }
        </a>
        <Block flex={1} marginLeft={8}>
          <header>
            <a href='#' onClick={props.showUserProfile}>
              <span className='display-name'>{props.owner.displayName}</span>
            </a>
            <a href='#' onClick={props.showUserProfile}>
              <span className='mention' style={Object.assign({}, {
                color: accent1Color
              })}>
                {props.owner.displayUsername}
              </span>
            </a>
            <span className='datetime'>{props.timestamp}</span>
          </header>
          <Message {...props} />
        </Block>
      </div>
    )
  }
}

MessageGroup.propTypes = {
  deleteMessage: React.PropTypes.func
}
