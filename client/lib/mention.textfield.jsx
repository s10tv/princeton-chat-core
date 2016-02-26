import React from 'react'
import ReactDOM from 'react-dom'
import keycode from 'keycode'
import Popover from 'material-ui/lib/popover/popover';
import {Menu, MenuItem} from './ui.jsx'
import TextField from 'material-ui/lib/text-field'

function getStyles(props, state) {
  const {
    anchorEl,
    } = state;

  const {
    fullWidth,
    } = props;

  const styles = {
    root: {
      display: 'inline-block',
      position: 'relative',
      width: fullWidth ? '100%' : 256,
    },
    menu: {
      width: '100%',
    },
    list: {
      display: 'block',
      width: fullWidth ? '100%' : 256,
    },
    innerDiv: {
      overflow: 'hidden',
    },
  };

  if (anchorEl && fullWidth) {
    styles.popover = {
      width: anchorEl.clientWidth,
    };
  }

  return styles;
}

export default React.createClass({

  getInitialState() {
    return {
      searchText: this.props.searchText,
      open: this.props.open,
      anchorEl: null,
      muiTheme: this.context.muiTheme,
      mentions: [],
      focusTextField: true
    };
  },

  getDefaultProps() {
    return {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
      },
      animated: false,
      disableFocusRipple: true,
      filter: (searchText, key) => searchText !== '' && key.includes(searchText),
      fullWidth: false,
      open: false,
      openOnFocus: false,
      searchText: '',
      fetchMentions: (word, callback) => {
        return callback([])
      },
      menuCloseDelay: 200,
      targetOrigin: {
        vertical: 'top',
        horizontal: 'left',
      },
    };
  },

  handleChange(event) {
    const searchText = event.target.value;

    // Make sure that we have a new searchText.
    // Fix an issue with a Cordova Webview
    if (searchText === this.state.searchText) {
      return;
    }

    this.setState({
      focusTextField: true,
      searchText: searchText,
      anchorEl: ReactDOM.findDOMNode(this.refs.searchTextField),
    })

    this.checkForMention(searchText)
  },

  close() {
    this.setState({
      focusTextField: false,
      open: false,
      anchorEl: null
    });
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
        console.log(results)
        if (results.length > 0) {
          return this.setState({
            open: true,
            mentions: results
          })
        }
      })
    }

    return this.close()
  },

  handleKeyDown(event) {
    switch (keycode(event)) {
      case 'enter':
      case 'esc':
        event.preventDefault()
        this.close();
        break;

      case 'down':
        event.preventDefault();
        this.setState({
          focusTextField: false
        });
        break;

      default:
        break;
    }
  },

  handleBlur(e) {
    if (this.state.focusTextField) {
      this.refs.searchTextField.focus();
    }

    //this.props.onBlur(e)
  },

  handleItemTouchTap (user) {
    const words = this.state.searchText.split(' ').filter((word) => word.length > 0)
    if (words.length > 0) {
      words.pop()
    }

    // replace last element with auto completed
    words.push(`@${user.username} `)
    this.setState({ searchText: words.join(' ') })

    this.setState({ open: false })
    this.refs.searchTextField.focus();
  },

  render() {
    const {
      anchorOrigin,
      animated,
      errorStyle,
      floatingLabelText,
      hintText,
      fullWidth,
      menuStyle,
      menuProps,
      listStyle,
      targetOrigin,
      ...other,
      } = this.props;

    const {
      open,
      anchorEl,
      searchText,
      focusTextField,
    } = this.state;

    const styles = getStyles(this.props, this.state)

    return (
      <div>
        <TextField
          {...other}
          ref="searchTextField"
          autoComplete="off"
          value={searchText}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onKeyDown={this.handleKeyDown}
          floatingLabelText={floatingLabelText}
          hintText={hintText}
          fullWidth={fullWidth}
          multiLine={false}
          errorStyle={errorStyle}
        />

        <Popover
          style={styles.popover}
          anchorOrigin={anchorOrigin}
          targetOrigin={targetOrigin}
          open={open}
          anchorEl={anchorEl}
          useLayerForClickAway={false}
          onRequestClose={this.close}
          animated={animated}
        >
          <Menu
            {...menuProps}
            ref="menu"
            autoWidth={false}
            zDepth={0}
            disableAutoFocus={focusTextField}
            onEscKeyDown={this.close}
            initiallyKeyboardFocused={false}
            listStyle={Object.assign(styles.list, listStyle)}
            style={Object.assign(styles.menu, menuStyle)}
          >
            {this.state.mentions.map((mention) => (
              <MenuItem key={mention._id}
                disableFocusRipple
                onTouchTap={() => this.handleItemTouchTap(mention)}
                primaryText={mention.username} />
            ))}
          </Menu>
        </Popover>
      </div>
    )
  }
})
