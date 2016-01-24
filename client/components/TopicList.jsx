import React from 'react';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import TextField from 'material-ui/lib/text-field';
import FlatButton from 'material-ui/lib/flat-button';
import truncate from 'truncate';
import DateFormatter from '../lib/DateFormatter';

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
    const { posts, topic, currentUser } = this.props;

    const listItems = posts.map((post) => {
      const renderedTopics = post.topics.map((topic) => {
        return (
          <a style={{ marginRight: 20 }} key={topic._id} href='#' onClick={() => { FlowRouter.go(`/topics/${topic._id}`)}}>
            { topic.displayName}
          </a>
        )
      });

      var renderedActions = null;
      if (currentUser.followingPosts.indexOf(post._id) >= 0) {
        renderedActions = (
          <a href='#' onClick={() => {
            Users.update(currentUser._id, { $pull: {
              followingPosts: post._id
            }});

            return false;
          }}>un-follow</a>
        )
      } else {
        renderedActions = (
          <a href='#' onClick={() => {
            Users.update(currentUser._id, { $addToSet: {
              followingPosts: post._id
            }});
            return false;
          }}>follow</a>
        )
      }

      return (
        <ListItem
          key={post._id}
          disabled={true}
          leftAvatar={
            <Avatar src={currentUser.avatar.url} />
          }
          rightAvatar={
            <div className="timestamp">{ DateFormatter.getTimestamp(post) }</div>
          }
        >
          <div className="question-container">
            <div className="user-name question-title">{ post.title }</div>
            <div className="question-title">{ truncate(post.content, 150) }</div>

            <p>{ renderedTopics }</p>

            <p>{ renderedActions }</p>

          </div>
        </ListItem>
      )
    })

    var leaveOrJoinChannel = null;
    if (currentUser.followingTopics &&
        currentUser.followingTopics.indexOf(topic._id) >= 0) {
          leaveOrJoinChannel = (
            <a href="#" className="topic-title" onClick={() => {
                console.log(currentUser._id);

                Users.update(currentUser._id, { $pull: {
                  followingTopics: topic._id
                }})
                return false;
              }}>Leave Channel</a>
          )
    } else {
      leaveOrJoinChannel = (
        <a href="#" className="topic-title" onClick={() => {
            Users.update(currentUser._id, { $addToSet: {
              followingTopics: topic._id
            }})
            return false;
          }}>Join Channel</a>
      )
    }

    const channelPreferences = !topic._id ? null : (
      <div>
        { leaveOrJoinChannel }
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
      </div>
    )

    return (
      <div>
        <div className="topic-title">{ topic.displayName }</div>
        { channelPreferences }

        <List>
          { listItems }
        </List>
        <div />
      </div>
    );
  }
}

export default Posts;
