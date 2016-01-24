import React from 'react';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';

const PRINCETON_ORANGE = '#F07621';
const PRINCETON_WHITE = 'white';

const AllTopics = ({topics}) => {
  const renderedTopics = topics.map((topic) => {
    return (
      <li key={topic._id}>
        <a href='#' onClick={() => {
            Users.update(Meteor.userId(), {
              $addToSet: {
                followingTopics: topic._id
              }
            })

            FlowRouter.go(`/topics/${topic._id}`)
          }}>{ topic.displayName}</a>
      </li>
    );
  })

  return (
    <ul>
      {renderedTopics}
    </ul>
  );
}

export default AllTopics;
