import React from 'react';
import {Flex} from 'jsxstyle';
import LeftNav from 'material-ui/lib/left-nav';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import FlatButton from 'material-ui/lib/flat-button';

import { i18n } from '/imports/libs/mantra'

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

    /**
     * Func to show topic followers modal from already fetched follower list
     */
    showTopicFollowersFromFollowersListFn: React.PropTypes.func
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
  <Flex flexDirection='column' padding='15px 20px' flexGrow={1}>
    <h3>About #{props.topic.displayName}</h3>
    <p>
      {props.topic.description}
    </p>

    <h4>List Address</h4>
    <a href={`mailto: ${props.topic._id}@${i18n('topicMailServer')}`}>
      {`${props.topic._id}@${i18n('topicMailServer')}`}
    </a>
    <h4>
      <a href='#' onClick={() => props.showTopicFollowersFromFollowersListFn(props.topic.followersList)}>
        Topic Followers ({props.topic.followers.length})
      </a>
    </h4>

    <List style={{paddingTop: 0, paddingBottom: 0}}>
      {
        props.topic.truncatedFollowersList.map(follower => (
        <ListItem key={follower._id} disabled={true} style={{padding: '15px 0px'}}>
          <a href='#' onClick={() => props.showUserProfile(follower)}>
            <Flex alignItems='center'>
              <Avatar src={follower.avatar.url} size={40}/>
              <Flex flexDirection='column' marginLeft={15}>
                { follower.displayName ?
                  <span style={{fontWeight: 500}}>
                    { follower.displayName }
                  </span>
                  :
                  null
                }
                <span style={Object.assign({color: '#57A3F0'}, follower.displayName && {marginTop: 15})}>
                  { follower.displayEmail }
                </span>
              </Flex>
            </Flex>
          </a>
        </ListItem>
        )
      )}
    </List>

    <FlatButton
      primary={true}
      onTouchTap={() => props.navigateToAddFollowers(props.topic._id)}
      label='Add Followers'
      style={{marginTop: 10, alignSelf: 'center'}}
      />
  </Flex>
)
