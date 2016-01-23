import React from 'react';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';

const PRINCETON_ORANGE = '#F07621';
const PRINCETON_WHITE = 'white';

const Posts = ({topic, posts}) => {

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
      <List>
        { listItems }
      </List>
      <div />
    </div>
  );
}

export default Posts;
