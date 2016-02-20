import React from 'react'
import {Flex} from 'jsxstyle'
import TextField from 'material-ui/lib/text-field'
import {FontIcon, IconButton} from '/client/lib/ui.jsx'
import { i18n } from '/client/configs/env'
import Radium from 'radium'

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
  searchIconContainer: {
    padding: '0 0 0 5px'
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
    currentSearchValue: React.PropTypes.string
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
      <a href='#' onClick={this.onToggleSearch}>
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
  propTypes: Object.assign({}, SearchBox.propTypes, {
    toggleSearch: React.PropTypes.func.isRequired
  }),

  componentDidMount () {
    this.refs.searchbox.focus()
  },

  getInitialState () {
    return {
      searchPeople: false
    }
  },

  updateInput (event) {
    const searchVal = event.currentTarget.value
    const isSearchingPeople = this.state.searchPeople
    if (searchVal && searchVal.trim().length > 0) {
      this.props.search(searchVal.trim(), isSearchingPeople)
    }
  },

  checkForEscapeKey (event) {
    if (event.keyCode === 27) {
      this.props.toggleSearch(event)
    }
  },

  toggleSearchType () {
    this.setState({
      searchPeople: !this.state.searchPeople
    })
  },

  render () {
    const searchIcon = this.state.searchPeople
      ? <Flex>
          <FontIcon className='material-icons' style={s.searchIcon}>
            person
          </FontIcon>
          <FontIcon className='material-icons' style={s.searchIcon}>
            expand_more
          </FontIcon>
        </Flex>
      : <Flex style={s.toggleButton}>
          <FontIcon className='material-icons' style={s.searchIcon}>
            view_headline
          </FontIcon>
          <FontIcon className='material-icons' style={s.searchIcon}>
            expand_more
          </FontIcon>
        </Flex>

    return (
      <Flex alignItems='center'>
        <IconButton onTouchTap={() => {
          this.toggleSearchType()
        }} style={s.searchIconContainer} iconStyle={s.searchIcon}>
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

export default Radium(SearchBox)
