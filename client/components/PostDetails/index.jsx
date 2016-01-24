import React from 'react';
import DateFormatter from '../../lib/DateFormatter'

const PRINCETON_ORANGE = '#F07621';
const PRINCETON_WHITE = 'white';

const PostDetails = ({post, owner}) => {
  return (
    <div>
      <h1>{ post.title }</h1>
      <div>{ post.content }</div>
      <div>author: { owner.firstName }</div>
      <div>time: { DateFormatter.getTimestamp(post) }</div>
    </div>
  );
}

export default PostDetails;
