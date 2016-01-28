import React from 'react'
import Dialog from 'material-ui/lib/dialog'
import FlatButton from 'material-ui/lib/flat-button'
import RaisedButton from 'material-ui/lib/raised-button'
import TextField from 'material-ui/lib/text-field'
import Select from 'react-select'
import {Flex} from 'jsxstyle'

export default React.createClass({

  onAddPost() {
    const title = this.refs.title.getValue();
    const content = this.refs.content.getValue();
    const topics = this.refs.topics.getValue();

    this.props.create(title, content, topics);
  },

  logChange(val) {
    console.log("Selected: " + val);
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
           <TextField ref="content" fullWidth={true} rows={5} multiLine={true}
             hintText='What do you want to say to other Princetonians?'
             floatingLabelText='Content' />

            <Select
              ref='topics'
              name='postTopics'
              placeholder='Add topics ... '
              options={allTopics}
              multi={true}
              simpleValue={true}
              onChange={this.logChange}
            />
         </Flex>
       </Dialog>
    )
  }
})
