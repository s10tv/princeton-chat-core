import React from 'react'
import ReactDOM from 'react-dom';
import {Flex} from 'jsxstyle'
import TextField from 'material-ui/lib/text-field'
import PersonAdd from 'material-ui/lib/svg-icons/social/person-add';
import RemoveRedEye from 'material-ui/lib/svg-icons/image/remove-red-eye';

import {Menu, MenuItem, FontIcon, IconButton, DropDownMenu} from '/client/lib/ui.jsx'
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

  getInitialState() {
    return {
      searchPeople: false
    }
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

  toggleSearchType () {
    this.setState({
      searchPeople: !this.state.searchPeople
    })
  },

  render() {
    const searchIcon = this.state.searchPeople
      ? (<Flex>
          <FontIcon className='material-icons' style={s.searchIcon}>
            person
          </FontIcon>
          <FontIcon className='material-icons' style={s.searchIcon}>
            expand_more
          </FontIcon>
        </Flex>)
      : (<Flex>
          <FontIcon className='material-icons' style={s.searchIcon}>
            view_headline
          </FontIcon>
          <FontIcon className='material-icons' style={s.searchIcon}>
            expand_more
          </FontIcon>
        </Flex>
      )

    return (
      <Flex alignItems='center'>
        <IconButton onTouchTap={() => {
          this.toggleSearchType()
        }} iconStyle={s.searchIcon}>
          {searchIcon}
        </IconButton>

        <TextField
          ref='searchbox'
          hintStyle={s.text}
          style={Object.assign({}, s.text, !this.props.isMobile ? {} : {
            width: 150
          })}
          inputStyle={Object.assign({}, s.text, s.textFocus)}
          underlineFocusStyle={{borderColor: accent1Color}}
          hintText={this.state.searchPeople ? 'Search people' : 'Search content'}
          defaultValue={this.props.currentSearchValue}
          onEnterKeyDown={this.updateInput}
          onKeyDown={this.checkForEscapeKey}
        />
      </Flex>
    )
  }
})

export default SearchBox
