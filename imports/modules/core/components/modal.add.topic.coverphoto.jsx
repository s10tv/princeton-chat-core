import React from 'react'
import Dialog from 'material-ui/lib/dialog'
import Toolbar from 'material-ui/lib/toolbar/toolbar'
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group'
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title'
import { Flex } from 'jsxstyle'
import FontIcon from 'material-ui/lib/font-icon'
import IconButton from 'material-ui/lib/icon-button'
import TextField from 'material-ui/lib/text-field'
import FlatButton from 'material-ui/lib/flat-button'
import UnsplashService from '/imports/libs/unsplash.service.js'
import { UnsplashDefaultCoverPhotos } from '/imports/libs/unsplash.service.js'
const SearchPhoto = React.createClass({
  propTypes: {
    /**
     * Func to change the current cover photo
     */
    chooseCoverPhoto: React.PropTypes.func.isRequired,

    /**
     * Func to close the modal
     */
    handleClose: React.PropTypes.func.isRequired
  },

  getInitialState () {
    return {
      photos: UnsplashDefaultCoverPhotos
    }
  },

  onSearch () {
    const searchText = this.refs.searchPhoto.getValue()
    if (searchText && searchText.length > 0) {
      new UnsplashService().search(searchText)
      .then((photos) => {
        this.setState({photos: photos})
      })
    }
  },

  selectPhoto (photo) {
    this.props.chooseCoverPhoto(photo)
    this.props.handleClose()
  },

  render () {
    return (
      <Flex flexDirection='column'>
        <Flex flexDirection='row'>
          <TextField ref='searchPhoto'
            hintText='Search for cover photos ... '
          />

          <FlatButton
            label='Search'
            labelPosition='after'
            primary
            onTouchTap={this.onSearch}
            icon={<FontIcon className='material-icons'>search</FontIcon>}
          />
        </Flex>

        <div style={{maxHeight: 400, overflowY: 'scroll'}}>
          <Flex flexDirection='column'>
            {this.state.photos.map((photo) => (
              <div key={photo.id} style={{
                height: 200,
                backgroundImage: `url("${photo.url}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
                onTouchTap={() => this.selectPhoto(photo)}
             />
            ))}
          </Flex>
        </div>
      </Flex>
    )
  }
})

export default React.createClass({
  propTypes: {
    /**
     * Function to call to dismiss the dialog box.
     */
    handleClose: React.PropTypes.func.isRequired,

    /**
     * True if this modal is showing.
     */
    isOpen: React.PropTypes.bool,

    /**
     * Func to change the current cover photo of new topic
     */
    chooseCoverPhoto: React.PropTypes.func
  },

  render () {
    const { handleClose, isOpen } = this.props

    const toolbar = (
      <Toolbar>
        <ToolbarGroup float='left'>
          <ToolbarTitle text='Add Topic' />
        </ToolbarGroup>
        <ToolbarGroup float='right' style={{top: '50%', transform: 'translateY(-50%)'}}>
          <IconButton tooltip='Close' onTouchTap={handleClose}>
            <FontIcon className='material-icons'>
              clear
            </FontIcon>
          </IconButton>
        </ToolbarGroup>
      </Toolbar>
    )

    return (
      <Dialog
        title={toolbar}
        modal={false}
        open={isOpen}
        onRequestClose={handleClose}>

        <SearchPhoto {...this.props} />
      </Dialog>
    )
  }
})

export { SearchPhoto }
