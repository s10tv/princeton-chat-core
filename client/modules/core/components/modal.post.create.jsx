import React from 'react'
import Dialog from '../../../../node_modules/material-ui/lib/dialog'
import RaisedButton from '../../../../node_modules/material-ui/lib/raised-button'
import TextField from '../../../../node_modules/material-ui/lib/text-field'
import Select from 'react-select'
import Toolbar from '../../../../node_modules/material-ui/lib/toolbar/toolbar'
import ToolbarGroup from '../../../../node_modules/material-ui/lib/toolbar/toolbar-group'
import ToolbarTitle from '../../../../node_modules/material-ui/lib/toolbar/toolbar-title'
import {Flex} from 'jsxstyle'
import IconButton from '../../../../node_modules/material-ui/lib/icon-button'
import FontIcon from '../../../../node_modules/material-ui/lib/font-icon'
import LinearProgress from '../../../../node_modules/material-ui/lib/linear-progress'
import { i18n } from '/client/config/env'

const theme = i18n('primaryMuiTheme')
const primaryAccent = theme.baseTheme.palette.accent1Color

export default React.createClass({
  propTypes: {
    /**
     * True if the modal should be showing.
     */
    isOpen: React.PropTypes.bool.isRequired,

    /**
     * Function to call when we want to close the modal.
     */
    handleClose: React.PropTypes.func.isRequired,

    /**
     * Function to call when we want to actually create the post.
     */
    create: React.PropTypes.func.isRequired,

    /**
     * A list of all of the topics to use for the selector
     */
    allTopics: React.PropTypes.array,

    /**
     * What the select box is rendered with initially.
     */
    topicIds: React.PropTypes.string,

    /**
     * A function to show the followers of the post.
     */
    showTopicFollowers: React.PropTypes.func.isRequired,

    /**
     * Updates the list of followers whenever a new topic is selected.
     */
    updateTopicFollowers: React.PropTypes.func.isRequired,

    /**
     * Number of people who will be notified about this post
     */
    numFollowersNotified: React.PropTypes.number.isRequired,

    /**
     * Function to show snackbar with an error string
     */
    showSnackbarError: React.PropTypes.func.isRequired,

    modifyAddPostTopic: React.PropTypes.func.isRequired,
    clearAddPostTopics: React.PropTypes.func.isRequired
  },

  getInitialState () {
    return {}
  },

  onAddPost () {
    const title = this.refs.title.getValue()
    const content = this.refs.content.getValue()
    const topics = this.props.topicIds

    // create action makes a callback with appropriate errors
    this.setState({
      loading: true
    })

    this.props.create(title, content, topics, (errors) => {
      if (errors) {
        this.setState({
          titleError: null,
          contentError: null,
          loading: false
        })
        errors.forEach((error) => {
          switch (error.type) {
            case 'title':
              this.setState({
                titleError: error.reason
              })
              break
            case 'content':
              this.setState({
                contentError: error.reason
              })
              break
            // fall through intentional
            case 'topics':
            case 'server':
              this.props.showSnackbarError(error.reason)
              break
          }
        })
      } else {
        this.setState({
          titleError: null,
          contentError: null,
          loading: false
        })

        this.props.clearAddPostTopics()
      }
    })
  },

  modifyTopicsList (value) {
    this.props.modifyAddPostTopic(value)
    this.props.updateTopicFollowers(value.split(','))
  },

  render () {
    const { isOpen, handleClose, allTopics, showTopicFollowers } = this.props

    const toolbar =
      <Toolbar>
        <ToolbarGroup float='left'>
          <ToolbarTitle text='New Post' />
        </ToolbarGroup>

        <ToolbarGroup float='right' style={{top: '50%', transform: 'translateY(-50%)'}}>
          <IconButton tooltip='Close' onTouchTap={handleClose}>
            <FontIcon className='material-icons'>clear</FontIcon>
          </IconButton>
        </ToolbarGroup>
      </Toolbar>

    return (
      <Dialog
        title={toolbar}
        bodyStyle={{ overflow: 'visible' }}
        actions={[
          !this.props.topicIds ? null
            : <a href='#' onClick={showTopicFollowers} style={{marginRight: 10}}>
              {this.props.numFollowersNotified} people will be notified
            </a>,
          <RaisedButton
            label='Post'
            primary
            onTouchTap={this.onAddPost} />
        ]}
        actionsContainerStyle={{padding: '0px 24px', paddingBottom: 24}}
        modal
        open={isOpen}>
        <Flex flexDirection='column'>
          {!this.state.titleError
            ? <TextField ref='title' fullWidth floatingLabelText='Subject' />
            : <TextField ref='title'
              errorStyle={{ color: primaryAccent, borderColor: primaryAccent }}
              fullWidth
              floatingLabelText='Subject'
              errorText={this.state.titleError} />}

          {!this.state.contentError
            ? <TextField ref='content' fullWidth
              rowsMax={5}
              rows={5}
              multiLine
              hintText='Start a conversation...'
              floatingLabelText='Content' />
            : <TextField ref='content'
              errorStyle={{ color: primaryAccent, borderColor: '#F07621' }}
              fullWidth
              rowsMax={5}
              rows={5}
              multiLine
              hintText='Start a conversation...'
              floatingLabelText='Content'
              errorText={this.state.contentError} />}

          <Select
            ref='topics'
            name='postTopics'
            placeholder='Add topics ... '
            options={allTopics}
            multi
            simpleValue
            value={this.props.topicIds}
            onChange={this.modifyTopicsList} />
          {!this.state.loading ? null : <LinearProgress mode='indeterminate' style={{marginTop: 20}}/>}
        </Flex>
      </Dialog>
    )
  }
})
