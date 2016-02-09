import React from 'react'
import {Flex, Block} from 'jsxstyle'
import {SquareAvatar} from '/imports/modules/core/components/helpers.jsx'
import IconMenu from 'material-ui/lib/menus/icon-menu'
import MenuItem from 'material-ui/lib/menus/menu-item'
import IconButton from 'material-ui/lib/icon-button'
import MoreHorizIcon from 'material-ui/lib/svg-icons/navigation/more-horiz'

export const Message = (props) => (
  <div className='message'>
    <div className='message-content'>{ props.content }</div>
    { props.action }
  </div>
)

export class MessageGroup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {hover: false, menuOpen: false}
  }
  render() {
    const props = this.props
    return (
      <div className='message-group' 
        onMouseEnter={() => this.setState({hover: true})}
        onMouseLeave={() => this.setState({hover: false})}
        style={{
          position: 'relative',
          display: 'flex',
          padding: '8px 16px',
        }}>
        {(this.state.hover || this.state.menuOpen) && props.deleteMessage ?
          <IconMenu
            style={{position: 'absolute', top: 8, right: 8,}}
            open={this.state.menuOpen}
            onRequestChange={(open) => { this.setState({menuOpen: open}) }}
            iconButtonElement={<IconButton><MoreHorizIcon /></IconButton>}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}>
            <MenuItem style={{color: 'red'}} primaryText="Delete message" onTouchTap={this.props.deleteMessage} />
          </IconMenu> : null
        }
        <a href="#" onClick={props.showUserProfile}>
          <SquareAvatar src={props.owner.avatar.url} length={50} />
        </a>
        <Block flex={1} marginLeft={8}>
          <header>
            <a href="#" onClick={props.showUserProfile}>
              <span className='display-name'>{ props.owner.displayName }</span>
            </a>
            <a href="#" onClick={props.showUserProfile}>
              <span className='mention'>{ props.owner.displayUsername }</span>
            </a>
            <span className='datetime'>{ props.timestamp }</span>
          </header>
          <Message {...props} />
        </Block>
      </div>
    )
  }
}

MessageGroup.propTypes = {
  deleteMessage: React.PropTypes.func,
}
