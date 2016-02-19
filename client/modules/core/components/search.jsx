import React from 'react'
import {Flex} from 'jsxstyle'
import {Menu, MenuItem, TextField} from '/client/lib/ui.jsx'

export default React.createClass({
  propTypes: {
    search: React.PropTypes.func.isRequired,
    searchResults: React.PropTypes.array.isRequired
  },

  getInitialState () {
    return {
      isBlurred: true
    }
  },

  onTextfieldFocus () {
    this.setState({ isBlurred: false })
  },

  onTextfieldBlur () {
    console.log('onTextfieldBlur called')
    this.setState({ isBlurred: true })
  },

  updateInput (event) {
    this.props.search(event.currentTarget.value)
  },

  render () {
    const searchResults = (this.props.searchResults.length === 0)
      ? null
      : <Menu>
        { this.props.searchResults.map((post) => (
          <MenuItem key={post._id} primaryText={post.title} />
        ))}
      </Menu>

    return (
      <Flex flexDirection='column'>
        <TextField
          hintText='Search ...'
          onFocus={this.onTextfieldFocus}
          onBlur={this.onTextfieldBlur}
          onChange={this.updateInput}
        />

        {searchResults}
      </Flex>
    )
  }
})
