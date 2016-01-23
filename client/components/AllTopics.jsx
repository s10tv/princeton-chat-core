import React from 'react';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';

const PRINCETON_ORANGE = '#F07621';
const PRINCETON_WHITE = 'white';

const AllTopics = ({topics}) => {
    const renderedTopics = topics.map((topic) => {
      return <li>{topic.displayName} | <a href='#' onClick={() => {console.log(topic._id); }}>Add</a></li>
    })


  return (
    <div>
      {renderedTopics}
    </div>
  );
}

export default AllTopics;
