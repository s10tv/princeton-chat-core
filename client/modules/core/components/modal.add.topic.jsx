import React from 'react'
import Toolbar from '../../../../node_modules/material-ui/lib/toolbar/toolbar'
import ToolbarGroup from '../../../../node_modules/material-ui/lib/toolbar/toolbar-group'
import ToolbarTitle from '../../../../node_modules/material-ui/lib/toolbar/toolbar-title'
import IconButton from '../../../../node_modules/material-ui/lib/icon-button'
import FontIcon from '../../../../node_modules/material-ui/lib/font-icon'
import Dialog from '../../../../node_modules/material-ui/lib/dialog'
import {Flex} from 'jsxstyle'
import RaisedButton from '../../../../node_modules/material-ui/lib/raised-button'
import TextField from '../../../../node_modules/material-ui/lib/text-field'
import { i18n } from 'client/configs/env'

export default React.createClass({
  propTypes: {
    /**
     * Boolean to show/hide modal
     */
    isOpen: React.PropTypes.bool.isRequired,

    /**
     * Func to close the modal
     */
    handleClose: React.PropTypes.func.isRequired,

    /**
     * Current cover photo for the new topic
     */
    currentCoverPhoto: React.PropTypes.object.isRequired,

    /**
     * Function to show choose cover photo modal
     */
    showAddTopicCoverPhotoModal: React.PropTypes.func.isRequired,

    /**
     * Function to validate topic name
     */
    validateTopicName: React.PropTypes.func.isRequired,

    /**
     * Function to validate topic description
     */
    validateTopicDescription: React.PropTypes.func.isRequired,

    /**
     * Func to show a snackbar with string
     */
    showSnackbarWithString: React.PropTypes.func.isRequired,

    /**
     * Func to create topic
     */
    createTopic: React.PropTypes.func.isRequired,

    /**
     * Bool to control whether creation of the new topic redirects to the topic screen
     */
    shouldRedirectToNewTopic: React.PropTypes.bool.isRequired,

    /**
     * The root URL of the app
     */
    rootUrl: React.PropTypes.string.isRequired
  },

  getInitialState () {
    return {
      topicName: null
    }
  },

  handleTopicNameChange (e) {
    this.setState({
      topicName: e.target.value
    })
  },

  createTopic () {
    const hasValidationError = (this.refs.topicNameContainer.hasValidationError() ||
      this.refs.topicDescriptionContainer.hasValidationError())

    if (!hasValidationError) {
      const topicInfo = {
        name: this.refs.topicNameContainer.refs.topicName.getValue(),
        description: this.refs.topicDescriptionContainer.refs.topicDescription.getValue(),
        cover: this.props.currentCoverPhoto
      }
      this.props.createTopic(topicInfo, this.props.shouldRedirectToNewTopic)
    } else {
      this.props.showSnackbarWithString('One of your fields has errors. Please check.')
    }
  },

  render () {
    const toolbar = (
      <Toolbar>
        <ToolbarGroup float='left'>
          <ToolbarTitle text='Create Channel' />
        </ToolbarGroup>
        <ToolbarGroup float='right' style={{top: '50%', transform: 'translateY(-50%)'}}>
          <IconButton tooltip='Close' onTouchTap={this.props.handleClose}>
            <FontIcon className='material-icons'>
              clear
            </FontIcon>
          </IconButton>
        </ToolbarGroup>
      </Toolbar>
    )

    return (
      <Dialog title={toolbar} open={this.props.isOpen} handleClose={this.props.handleClose}
        modal={false} bodyStyle={{overflowY: 'scroll', paddingBottom: 0}} bodyClassName='no-scrollbar'>
        <Flex flexDirection='column' flexGrow={1}>
          <Flex style={{
            height: 200,
            backgroundImage: `url("${this.props.currentCoverPhoto.url}")`,
            padding: 20,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            <RaisedButton secondary onTouchTap={this.props.showAddTopicCoverPhotoModal}
              label='Choose Cover' />
          </Flex>

          <ValidatableTextField fullWidth floatingLabelText='Name' hintText='What do you call this channel?'
            ref='topicNameContainer' refComponent='topicName' onChange={this.handleTopicNameChange}
            validateField={this.props.validateTopicName}/>
          <TextField fullWidth disabled floatingLabelText='Channel URL'
            value={this.state.topicName ? `${this.props.rootUrl}/topics/${this.state.topicName}` : ''} />
          <TextField fullWidth disabled floatingLabelText='Channel Email'
            value={this.state.topicName ? `${this.state.topicName}@${i18n('topicMailServer')}` : ''} />
          <ValidatableTextField fullWidth floatingLabelText='Description'
            hintText='What is this channel about?'
            multiLine rows={3} rowsMax={3} ref='topicDescriptionContainer'
            refComponent='topicDescription' validateField={this.props.validateTopicDescription} />
          <RaisedButton primary label='Create Channel' onTouchTap={this.createTopic}
            style={{marginTop: 15, alignSelf: 'center', marginBottom: 24}}/>
        </Flex>
      </Dialog>
    )
  }
})

// a generic component, can be used outside the scope of add topic
const ValidatableTextField = React.createClass({
  propTypes: {
    /**
     * Function to validate the text field, should return { type, reason } on error, empty
     * object on success
     */
    validateField: React.PropTypes.func.isRequired,

    /**
     * Ref of the text field
     */
    refComponent: React.PropTypes.string.isRequired
  },

  getInitialState () {
    return {
      error: null
    }
  },

  handleBlur (e) {
    const error = this.props.validateField(e.target.value)
    if (error.reason) {
      this.setState({ error: error.reason })
    } else {
      this.setState({ error: null })
    }
  },

  hasValidationError () {
    const textField = this.refs[this.props.refComponent]
    const error = this.props.validateField(textField.getValue())
    if (error.reason) {
      this.setState({ error: error.reason })
    } else {
      this.setState({ error: null })
    }

    return this.state.error != null || error.reason
  },

  render () {
    return !this.state.error
    ? <TextField {...this.props} ref={this.props.refComponent} onBlur={this.handleBlur} />
    : <TextField {...this.props} ref={this.props.refComponent}
      errorText={this.state.error} onBlur={this.handleBlur}/>
  }
})
