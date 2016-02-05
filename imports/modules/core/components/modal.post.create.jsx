import React from 'react'
import Dialog from 'material-ui/lib/dialog'
import FlatButton from 'material-ui/lib/flat-button'
import RaisedButton from 'material-ui/lib/raised-button'
import TextField from 'material-ui/lib/text-field'
import Select from 'react-select'
import Toolbar from 'material-ui/lib/toolbar/toolbar'
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group'
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator'
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title'
import {Flex} from 'jsxstyle'
import IconButton from 'material-ui/lib/icon-button'
import FontIcon from 'material-ui/lib/font-icon'

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
    showSnackbarErrorOnNewPost: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return { selectedTopicIds: '' };
  },

  onAddPost() {
    const title = this.refs.title.getValue();
    const content = this.refs.content.getValue();
    const topics = this.state.selectedTopicIds;
    const errors = this.props.create(title, content, topics);

    if (errors.length != 0) {
      this.setState({
        titleError: null,
        contentError: null
      })
      errors.forEach(error => {
        switch (error.type) {
          case 'title':
            this.setState({
              titleError: error.reason
            })
            break;
          case 'content':
            this.setState({
              contentError: error.reason
            });
            break;
          case 'topics':
            this.props.showSnackbarErrorOnNewPost(error.reason);
            break;
        }
      })
    } else {
      this.setState({
        selectedTopicIds: null,
        titleError: null,
        contentError: null
      });
    }
  },

  modifyTopicsList(value) {
    this.setState({
      selectedTopicIds: value
    })

    this.props.updateTopicFollowers(value.split(','));
  },

  render() {
    const { isOpen, handleClose, allTopics, showTopicFollowers } = this.props;

    const isFollowersDisabled = this.state.selectedTopicIds == '';

    const toolbar =
      <Toolbar>
        <ToolbarGroup float="left">
          <ToolbarTitle text="New Post" />
        </ToolbarGroup>

        <ToolbarGroup float='right' style={{top: '50%', transform: 'translateY(-50%)'}}>
          <IconButton tooltip="Close" onTouchTap={handleClose}>
            <FontIcon className="material-icons">clear</FontIcon>
          </IconButton>
        </ToolbarGroup>
      </Toolbar>

    return (
      <Dialog
         title={toolbar}
         bodyStyle={{ overflow: 'visible' }}
         actions={[
           !this.state.selectedTopicIds ? null :
           <a href='#' onClick={this.props.showTopicFollowers} style={{marginRight: 10}}>{this.props.numFollowersNotified} people will be notified</a>
           ,
           <RaisedButton
             label='Post'
             primary={true}
             onTouchTap={this.onAddPost} />,
         ]}
         actionsContainerStyle={{padding: 24}}
         modal={true}
         open={isOpen}>
         <Flex flexDirection='column'>
           { !this.state.titleError ? <TextField ref="title" fullWidth={true} floatingLabelText='Subject' />
         : <TextField ref="title" errorStyle={{ color: '#F07621', borderColor: '#F07621' }} fullWidth={true} floatingLabelText='Subject' errorText={this.state.titleError} /> }

           { !this.state.contentError ?
           <TextField ref="content" fullWidth={true} multiLine={true} rowsMax={5} rows={5} multiLine={true}
             hintText='Start a conversation...'
             floatingLabelText='Content' />
           : <TextField ref="content" errorStyle={{ color: '#F07621', borderColor: '#F07621' }} fullWidth={true} multiLine={true} rowsMax={5} rows={5} multiLine={true}
                        hintText='Start a conversation...'
                        floatingLabelText='Content'
                        errorText={this.state.contentError} /> }

           <Select
             ref='topics'
             name='postTopics'
             placeholder='Add topics ... '
             options={allTopics}
             multi={true}
             simpleValue={true}
             value={this.state.selectedTopicIds}
             onChange={this.modifyTopicsList}
           />
         </Flex>
       </Dialog>
    )
  }
})

// { isFollowersDisabled ? null :
//   <ToolbarGroup float="right" lastChild={true}>
//     <RaisedButton
//       label="Show Followers"
//       primary={true}
//       onTouchTap={showTopicFollowers}  />
