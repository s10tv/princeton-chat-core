import React from 'react'
import Dialog from '../../../../node_modules/material-ui/lib/dialog'
import RaisedButton from '../../../../node_modules/material-ui/lib/raised-button'
import Select from 'react-select'
import Toolbar from '../../../../node_modules/material-ui/lib/toolbar/toolbar'
import ToolbarGroup from '../../../../node_modules/material-ui/lib/toolbar/toolbar-group'
import ToolbarTitle from '../../../../node_modules/material-ui/lib/toolbar/toolbar-title'
import {Flex} from 'jsxstyle'
import IconButton from '../../../../node_modules/material-ui/lib/icon-button'
import FontIcon from '../../../../node_modules/material-ui/lib/font-icon'
import LinearProgress from '../../../../node_modules/material-ui/lib/linear-progress'
import {color} from '/client/configs/theme'
import {TextField} from '/client/lib/ui.jsx'

/**
 * https://github.com/erikras/redux-form/issues/82
 */
class ReduxFormSelect extends React.Component {
  render () {
    const {value, onBlur, ...props} = this.props // onBlur and value was on this.props.fields.myField in MyForm
    return <Select
      value={value || ''}          // because react-select doesn't like the initial value of undefined
      onBlur={() => onBlur(value)} // just pass the current value (updated on change) on blur
      {...props} />                // options are part of other props
  }
}

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
     * A list of all of the topics to use for the selector
     */
    allTopics: React.PropTypes.array,

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

    fields: React.PropTypes.shape({
      title: React.PropTypes.object.isRequired,
      content: React.PropTypes.object.isRequired,
      topicIds: React.PropTypes.object.isRequired
    }).isRequired,
    handleSubmit: React.PropTypes.func.isRequired
  },

  modifyTopicsList (value) {
    this.props.fields.topicIds.onChange(value)
    this.props.updateTopicFollowers(value.split(','))
  },

  render () {
    const { fields: {title, content, topicIds}, isOpen, handleClose,
      allTopics, showTopicFollowers, handleSubmit, submitting, error,
      numFollowersNotified} = this.props

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

    console.log('submitting', submitting)

    return (
      <form onSubmit={handleSubmit}>
        <Dialog
          title={toolbar}
          bodyStyle={{ overflow: 'visible' }}
          actions={[
            !this.props.fields.topicIds ? null
              : <a href='#' onClick={showTopicFollowers} style={{marginRight: 10}}>
                {numFollowersNotified} people will be notified
              </a>,
            <RaisedButton
              label='Post'
              primary
              disabled={submitting}
              onTouchTap={handleSubmit} />
          ]}
          actionsContainerStyle={{padding: '0px 24px', paddingBottom: 24}}
          modal
          open={isOpen}>
          <Flex flexDirection='column'>
            <TextField
              {...title}
              fullWidth
              floatingLabelText='Subject' />

            <TextField
              {...content}
              fullWidth
              rowsMax={5}
              rows={5}
              multiLine
              hintText='Start a conversation...'
              floatingLabelText='Content' />

            <ReduxFormSelect {...topicIds}
              placeholder='Post in channels ... '
              options={allTopics}
              multi
              simpleValue
              onChange={this.modifyTopicsList} />

            {submitting && <LinearProgress color={color.brand.primary} style={{
              marginTop: 15
            }} />}

            {error && <p style={{
              color: color.brand.danger,
              marginTop: 15,
              marginBottom: 15
            }}>{error}</p>}
          </Flex>
        </Dialog>
      </form>
    )
  }
})
