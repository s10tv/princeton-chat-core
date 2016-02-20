import React from 'react'
import ReactDOM from 'react-dom';
import {Flex} from 'jsxstyle'
import TextField from 'material-ui/lib/text-field'

import {Menu, MenuItem, FontIcon, IconButton} from '/client/lib/ui.jsx'
import color from '/client/configs/color'
import { i18n } from '/client/configs/env'

const theme = i18n('primaryMuiTheme')
const accent1Color = theme.baseTheme.palette.accent1Color

const s = {
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
    padding: '0px 15px',
    height: 48
  },
  searchIcon: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
    marginRight: 5
  },
  text: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: 300,
    fontSize: 16
  },
  textFocus: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: 500,
    fontSize: 16
  }
}

const SearchBox = React.createClass({
  propTypes: {
    search: React.PropTypes.func.isRequired,
    currentSearchValue: React.PropTypes.string,
  },

  getInitialState () {
    return {
      expanded: false
    }
  },

  onToggleSearch (event) {
    event.preventDefault()
    this.setState({
      expanded: !this.state.expanded
    })
  },

  render () {
    if (this.state.expanded || this.props.currentSearchValue) {
      return <Flex flexDirection='column' style={s.container}>
        <FocusedTextField {...this.props} toggleSearch={this.onToggleSearch} />
      </Flex>
    }

    return (
      <a href="#" onClick={this.onToggleSearch}>
        <Flex style={s.container} alignItems='center'>
          <FontIcon className='material-icons' style={s.searchIcon}>
            search
          </FontIcon>
          <span style={s.text}>Search</span>
        </Flex>
      </a>
    )
  }
})

const FocusedTextField = React.createClass({
  propTypes: {
    ...SearchBox.propTypes,
    toggleSearch: React.PropTypes.func.isRequired
  },

  componentDidMount() {
    this.refs.searchbox.focus();
  },

  updateInput (event) {
    const searchVal = event.currentTarget.value
    if (searchVal && searchVal.trim().length > 0) {
      this.props.search(searchVal.trim())
    }
  },

  checkForEscapeKey (event) {
    if (event.keyCode == 27) {
      this.props.toggleSearch(event)
    }
  },

  render() {
    return (
      <Flex alignItems='center'>
        <FontIcon className='material-icons' style={s.searchIcon}>
          search
        </FontIcon>
        <TextField
          ref='searchbox'
          hintStyle={s.text}
          style={Object.assign({}, s.text, !this.props.isMobile ? {} : {
            width: 150
          })}
          onBlur={this.props.toggleSearch}
          inputStyle={Object.assign({}, s.text, s.textFocus)}
          underlineFocusStyle={{borderColor: accent1Color}}
          hintText='Search ... '
          defaultValue={this.props.currentSearchValue}
          onEnterKeyDown={this.updateInput}
          onKeyDown={this.checkForEscapeKey}
        />
      </Flex>
    )
  }
})

export default SearchBox
