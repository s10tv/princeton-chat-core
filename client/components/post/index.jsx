import React from 'react';
import FlatButton from 'material-ui/lib/flat-button';

const Post = ({post}) => (
  <div>
    {post.saving ? <p>Saving...</p> : null}
    <h2>{post.title}</h2>
    <p>
      {post.content}
      <FlatButton label="Primary" primary={true} />
    </p>
  </div>
);

export default Post;
