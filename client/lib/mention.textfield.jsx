import React from 'react'
import ReactDOM from 'react-dom'
import keycode from 'keycode'
import Popover from 'material-ui/lib/popover/popover'
import {Menu, MenuItem} from './ui.jsx'
import { LetterAvatar, CoverAvatar } from '/client/modules/core/components/helpers.jsx'
import TextField from 'material-ui/lib/text-field'

function getStyles (props, state) {
  const {anchorEl} = state

  const {fullWidth} = props

  const styles = {
    root: {
      display: 'inline-block',
      position: 'relative',
      width: fullWidth ? '100%' : 256
    },
    menu: {
      width: '100%'
    },
    list: {
      display: 'block',
      width: fullWidth ? '100%' : 256
    },
    innerDiv: {
      overflow: 'hidden'
    }
  }

  if (anchorEl && fullWidth) {
    styles.popover = {
      width: anchorEl.clientWidth
    }
  }

  return styles
}

export default React.createClass({

  getInitialState () {
    return {
      anchorEl: null,
      focusMenu: false,
      muiTheme: this.context.muiTheme
    }
  },

  getDefaultProps () {
    return {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left'
      },
      animated: false,
      disableFocusRipple: true,
      fullWidth: true,
      clearTextOnEnter: false,
      value: '',
      onKeyDown: () => {},
      onMentionTap: () => {},
      onBlur: () => {},
      mentions: [],
      targetOrigin: {
        vertical: 'top',
        horizontal: 'left'
      }
    }
  },

  close () {
    this.props.clearMentions()
  },

  handleChange (event) {
    this.props.onChange(event)
    this.setState({
      anchorEl: ReactDOM.findDOMNode(this.refs.searchTextField)
    })
    this.__focusTextField()
  },

  handleKeyDown (event) {
    switch (keycode(event)) {
      case 'enter':
        this.props.onKeyDown(event)
        break
      case 'esc':
        event.preventDefault()
        this.close()
        break

      case 'up':
      case 'down':
        event.preventDefault()
        this.setState({
          focusMenu: true
        })
        break

      default:
        this.props.onKeyDown(event)
    }

    this.__focusTextField()
  },

  // the onFocus of redux form messes with this. pass in empty function for mow
  handleFocus () {},

  handleItemTouchTap (user) {
    this.props.onMentionTap(user)
    this.props.clearMentions()
    this.__focusTextField()
    this.setState({
      focusMenu: false
    })
  },

  // async unfocus the text field prevents UI from locking
  __focusTextField () {
    setTimeout(() => {
      this.refs.searchTextField.focus()
    }, 50)
  },

  render () {
    const {
      anchorOrigin,
      floatingLabelText,
      hintText,
      fullWidth,
      menuStyle,
      menuProps,
      listStyle,
      targetOrigin,
      mentions,
      value,
      ...other
    } = this.props

    const {
      anchorEl
    } = this.state

    const styles = getStyles(this.props, this.state)
    return (
      <div style={{ width: '100%' }} {...this.props.styles}>
        <TextField
          ref='searchTextField'
          autoComplete='off'
          floatingLabelText={floatingLabelText}
          hintText={hintText}
          fullWidth={fullWidth}
          {...other}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onKeyDown={this.handleKeyDown}
          value={value}
          errorText={this.props.touched && this.props.error}
        />

        <Popover
          animated
          style={styles.popover}
          anchorOrigin={anchorOrigin}
          targetOrigin={targetOrigin}
          open={!!anchorEl && mentions.length > 0}
          anchorEl={anchorEl}
          useLayerForClickAway={false}
          onRequestClose={this.close}
        >
          <Menu
            {...menuProps}
            disableAutoFocus
            autoWidth={false}
            zDepth={0}
            onEscKeyDown={this.close}
            initiallyKeyboardFocused={this.state.focusMenu}
            listStyle={Object.assign(styles.list, listStyle)}
            style={Object.assign(styles.menu, menuStyle)}
          >
            {mentions.map((user) => {
              const avatar = user.avatar.isDefaultAvatar
                ? <LetterAvatar key={user._id} style={{marginRight: 3}} color='white'
                  backgroundColor={user.avatar.color}>
                  {user.avatarInitials}
                </LetterAvatar>
                : <CoverAvatar key={user._id} style={{marginRight: 3}} src={user.avatar.url} />

              return <MenuItem
                rightAvatar={avatar}
                key={user._id}
                focusState='keyboard-focused'
                disableFocusRipple
                onTouchTap={() => this.handleItemTouchTap(user)}
                primaryText={user.username}/>
            })}
          </Menu>
        </Popover>
      </div>
    )
  }
})
