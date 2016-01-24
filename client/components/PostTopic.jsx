import React from 'react';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';

const PRINCETON_ORANGE = '#F07621';
const PRINCETON_WHITE = 'white';

export default class PostTopic extends React.Component {

  onAddContent() {
    const { FlowRouter } = this.props;

    const title = this.refs.title.getValue();
    const content = this.refs.content.getValue();
    const topicIds = this.refs.topicIds.getValue().split(',');

    if (topicIds.length == 0) {
      return alert('Please tag your content with at least 1 topicId');
    }

    Meteor.call('post/insert', title, content, topicIds, (err, res) => {
      if (err) {
        return alert(err.reason);
      }

      FlowRouter.go(`/topics/${topicIds[0]}`);
    });
  }

  render() {
    return (
      <div>
        <h1>Add new Post</h1>
        <List>
          <ListItem>
            <TextField
              ref="title"
              hintText="Title"
              hintStyle={{color: PRINCETON_ORANGE}}
              multiLine={true}
            />
          </ListItem>
          <ListItem>
            <TextField
              ref="content"
              hintText="content"
              hintStyle={{color: PRINCETON_ORANGE}}
              multiLine={true}
            />
          </ListItem>
          <ListItem>
            <TextField
              ref="topicIds"
              hintText="commma separated topic ids"
              hintStyle={{color: PRINCETON_ORANGE}}
            />
          </ListItem>
          <ListItem>
            <FlatButton label="Submit" onClick={this.onAddContent.bind(this) }/>
          </ListItem>
        </List>
      </div>
    )
  }
};
