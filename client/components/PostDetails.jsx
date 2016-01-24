import React from 'react';

const PRINCETON_ORANGE = '#F07621';
const PRINCETON_WHITE = 'white';

const PostDetails = ({post}) => {
  console.log(post);
  return (
    <div>
      <h1>{ post.title }</h1>
      <div>{ post.content }</div>
    </div>
  );
}

export default PostDetails;
