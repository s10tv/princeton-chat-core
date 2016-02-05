import React from 'react';
import {Flex} from 'jsxstyle';
import LeftNav from 'material-ui/lib/left-nav';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';

export default React.createClass({
  propTypes: {
    /**
     * Boolean to show/hide right bar
     */
    isOpen: React.PropTypes.bool.isRequired,



    // FOR POST LIST SCREEN
    /**
     * Topic to render
     */
    topic: React.PropTypes.object,

    /**
     * Posts to render (array can be empty).
     */
    posts: React.PropTypes.array,

    /**
     * A function to show the followers of the post.
     */
    showPostFollowers: React.PropTypes.func,
  },

  render() {
    return (
      <LeftNav width={320} openRight={true} open={this.props.isOpen} style={{display:'flex'}}>
        <PostListContent {...this.props} />
      </LeftNav>
    )
  }
});

const PostListContent = (props) => (
  <Flex flexDirection='column' padding='15px 20px'>
    <h3>About #{props.topic.displayName}</h3>
    <p>
      {props.topic.description}
    </p>

    <h4>List Address</h4>
    <a href={'mailto:' + props.topic._id + '@topics.princeton.chat'}>{props.topic._id}@topics.princeton.chat</a>

    <h4>Topic Followers ({props.topic.followers.length})</h4>
    <List style={{paddingTop: 0, paddingBottom: 0}}>
      {
        props.topic.followersList.map(follower => (
        <ListItem key={follower._id} disabled={true} style={{padding: '15px 0px'}}>
          <a href='#' onClick={() => props.showUserProfile(follower)}>
            <Flex alignItems='center'>
              <Avatar src={follower.avatar.url} size={40}/>
              <Flex flexDirection='column' marginLeft={15}>
                <span style={{fontWeight: 500}}>
                  { follower.displayName }
                </span>
                <span style={{color: '#57A3F0', marginTop: 15}}>
                  @{ follower.username }
                </span>
              </Flex>
            </Flex>
          </a>
        </ListItem>
        )
      )}
    </List>

    <a>Add Followers</a>
  </Flex>
)
