import React from 'react'
import {Flex, Block} from 'jsxstyle'
import Linkify from 'react-linkify'
import IconMenu from '../../../../node_modules/material-ui/lib/menus/icon-menu'
import MenuItem from '../../../../node_modules/material-ui/lib/menus/menu-item'
import IconButton from '../../../../node_modules/material-ui/lib/icon-button'
import MoreHorizIcon from '../../../../node_modules/material-ui/lib/svg-icons/navigation/more-horiz'
import Radium from 'radium'
import { i18n } from '/client/configs/env'
import {LetterAvatar, CoverAvatar} from '/client/modules/core/components/helpers.jsx'

const theme = i18n('secondaryMuiTheme')
const accent1Color = theme.baseTheme.palette.accent1Color

const s = {
  message: {
    fontWeight: 300,
    letterSpacing: '0.1px',
    marginTop: 4,
    marginBottom: 4,
    fontSize: 15,
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-work'
  },
  messageGroup: {
    ':hover': {
      backgroundColor: '#F7F7F7'
    }
  }
}

export const Message = (props) => (
  <div>
    <div style={s.message}>
      <Linkify properties={{
        target: '_blank',
        style: { color: accent1Color },
        onClick: props.messageLinkOnClick
      }}>
        {props.content}
      </Linkify>
    </div>
    {props.action}
  </div>
)

class MessageGroupComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {hover: false, menuOpen: false}
  }
  render () {
    const props = this.props
    return (
      <Flex
        flexShrink='0'
        onMouseEnter={() => this.setState({hover: true})}
        onMouseLeave={() => this.setState({hover: false})}
        style={Object.assign({
          position: 'relative',
          padding: '8px 16px'
        }, s.message, s.messageGroup)}>
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
              <span style={{ marginRight: 8, fontWeight: 400 }}>{props.owner.displayName}</span>
            </a>
            <a href='#' onClick={props.showUserProfile}>
              <span style={Object.assign({}, {
                marginRight: 8,
                fontWeight: 300,
                color: accent1Color
              })}>
                {props.owner.displayUsername}
              </span>
            </a>
            <span style={{fontSize: 14, fontWeight: 300, color: '#888'}}>{props.timestamp}</span>
          </header>
          <Message {...props} />
        </Block>
      </Flex>
    )
  }
}

MessageGroupComponent.propTypes = {
  deleteMessage: React.PropTypes.func
}

export const MessageGroup = Radium(MessageGroupComponent)

