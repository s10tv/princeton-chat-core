import React from 'react';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import TextField from 'material-ui/lib/text-field';
import FlatButton from 'material-ui/lib/flat-button';

const PRINCETON_ORANGE = '#F07621';
const PRINCETON_WHITE = 'white';

class Posts extends React.Component {

  onAddContent() {
    const { topic } = this.props;
    const title = this.refs.title.getValue();
    const content = this.refs.content.getValue();

    Meteor.call('post/insert', title, content, [topic._id]);
  }

  render() {
    const { posts, topic } = this.props;

    const listItems = posts.map((post) => {
      return (
        <ListItem
          key={post._id}
          disabled={true}
          leftAvatar={
            <Avatar src="/images/nph.jpg" />
          }
          rightAvatar={
            <div className="timestamp">3:55pm</div>
          }
        >
          <div className="question-container">
            <div className="user-name question-title">{ post.title }</div>
            <div className="question-title">{ post.content }</div>
          </div>
        </ListItem>
      )
    })

    return (
      <div>
        <div className="topic-title">{ topic.displayName }</div>
        <a href="#" className="topic-title" onClick={() => {
            Users.update(Meteor.userId(), { $pull: {
              followingTopics: topic._id
            }})
            return false;
          }}>Leave Channel</a>
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
            <FlatButton label="Submit" onClick={this.onAddContent.bind(this) }/>
          </ListItem>
        </List>

        <List>
          { listItems }
        </List>
        <div />
      </div>
    );
  }
}

export default Posts;
