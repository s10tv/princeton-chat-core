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
      searchText: this.props.searchText,
      open: this.props.open,
      anchorEl: null,
      muiTheme: this.context.muiTheme,
      mentions: [],
      focusTextField: false
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
      open: false,
      clearTextOnEnter: false,
      searchText: '',
      onKeyDown: () => {},
      onBlur: () => {},
      fetchMentions: (word, callback) => {
        return callback([])
      },
      targetOrigin: {
        vertical: 'top',
        horizontal: 'left'
      }
    }
  },

  handleChange (event) {
    const searchText = event.target.value

    // Make sure that we have a new searchText.
    // Fix an issue with a Cordova Webview
    if (searchText === this.state.searchText) {
      return
    }

    this.setState({
      focusTextField: true,
      searchText: searchText,
      anchorEl: ReactDOM.findDOMNode(this.refs.searchTextField)
    })

    this.checkForMention(searchText)
    this.props.onChange(event)
  },

  close () {
    this.setState({
      focusTextField: false,
      open: false,
      anchorEl: null
    })
  },

  checkForMention (text) {
    if (!text) {
      return this.close()
    }

    const words = text.split(' ').filter((word) => word.length > 0)

    // text area is empty or all spaces
    if (words.length === 0) {
      return this.close()
    }

    const lastWord = words[words.length - 1]
    if (lastWord.charAt(0) === '@' && lastWord.length > 1) {
      return this.props.fetchMentions(lastWord.substring(1), (results) => {
        if (results.length > 0) {
          return this.setState({
            open: true,
            mentions: results
          })
        }
      })
    }

    this.close()
    this.__focusTextField()
  },

  handleKeyDown (event) {
    switch (keycode(event)) {
      case 'enter':
        if (this.props.clearTextOnEnter) {
          this.setState({
            searchText: ''
          })
        }
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
          focusTextField: false
        })
        break

      default:
        this.props.onKeyDown(event)
    }
  },

  handleBlur (e) {
    if (this.state.focusTextField) {
      this.__focusTextField()
    }

    this.props.onBlur(e)
  },

  handleFocus () {
    // If we use props.onFocus() here, the onFocus from redux form causes the menu to
    // quickly pop up and then disappear again. Not the intended behavior. Put in this
    // solution of using another prop for now.
    // Tracking in
    //
    if (!this.state.focusTextField) {
      this.__focusTextField()
    }
  },

  handleItemTouchTap (user) {
    const words = this.state.searchText.split(' ').filter((word) => word.length > 0)
    if (words.length > 0) {
      words.pop()
    }

    // replace last element with auto completed
    words.push(`@${user.username} `)

    this.setState({
      searchText: words.join(' '),
      open: false
    })

    this.__focusTextField()
  },

  __focusTextField () {
    // async unfocus the text field prevents UI from locking
    // 50 is arbitrary.
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
      ...other
    } = this.props

    const {
      open,
      anchorEl,
      searchText,
      focusTextField
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
          onBlur={this.handleBlur}
          onKeyDown={this.handleKeyDown}
          value={searchText}
          errorText={this.props.touched && this.props.error}
        />

        <Popover
          animated
          style={styles.popover}
          anchorOrigin={anchorOrigin}
          targetOrigin={targetOrigin}
          open={open}
          anchorEl={anchorEl}
          useLayerForClickAway={false}
          onRequestClose={this.close}
        >
          <Menu
            {...menuProps}
            autoWidth={false}
            zDepth={0}
            disableAutoFocus={focusTextField}
            onEscKeyDown={this.close}
            initiallyKeyboardFocused={false}
            listStyle={Object.assign(styles.list, listStyle)}
            style={Object.assign(styles.menu, menuStyle)}
          >
            {this.state.mentions.map((user) => {
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
