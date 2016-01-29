import React from 'react'
import Dialog from 'material-ui/lib/dialog'
import FlatButton from 'material-ui/lib/flat-button'
import RaisedButton from 'material-ui/lib/raised-button'
import TextField from 'material-ui/lib/text-field'
import Select from 'react-select'
import {Flex} from 'jsxstyle'

export default React.createClass({

  getInitialState() {
    return { topicIds: '' };
  },

  onAddPost() {
    const title = this.refs.title.getValue();
    const content = this.refs.content.getValue();
    const topics = this.state.topicIds;
    this.props.create(title, content, topics);
  },

  modifyTopicsList(value) {
    this.setState({
      topicIds: value
    })
  },

  render() {
    const {isOpen, handleClose, allTopics} = this.props;
    return (
      <Dialog
         title='New Post'
         bodyStyle={{ overflow: 'visible' }}
         actions={[
           <FlatButton
                 label='Cancel'
                 secondary={true}
                 onTouchTap={handleClose} />,
           <FlatButton
             label='Post'
             primary={true}
             onTouchTap={this.onAddPost} />,
         ]}
         modal={true}
         open={isOpen}>
         <Flex flexDirection='column'>
           <TextField ref="title" fullWidth={true} floatingLabelText='Title' />
           <TextField ref="content" fullWidth={true} multiLine={true} rowsMax={5} rows={5} multiLine={true}
             hintText='What do you want to say to other Princetonians?'
             floatingLabelText='Content' />

            <Select
              ref='topics'
              name='postTopics'
              placeholder='Add topics ... '
              options={allTopics}
              multi={true}
              simpleValue={true}
              value={this.state.topicIds}
              onChange={this.modifyTopicsList}
            />
         </Flex>
       </Dialog>
    )
  }
})
