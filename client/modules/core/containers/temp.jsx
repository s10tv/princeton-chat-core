import React from 'react'
import PostList from '/client/modules/core/containers/post.list'
import DirectorySearch from '/client/modules/core/containers/directory.search'
import _PostDetails from '/client/modules/core/containers/post.details'
import AddFollowers from '/client/modules/core/containers/add.followers'

export const GroupChannel = ({params}) => (
  <PostList topicId={params.channelId} />
)

GroupChannel.propTypes = {
  params: React.PropTypes.shape({
    channelId: React.PropTypes.string.isRequired
  }).isRequired
}

export const PostSearch = ({location: {query}}) => (
  <PostList postListType='SEARCH' term={query.term} />
)

export const AllPosts = () => (
  <PostList postListType='ALL' />
)

export const Directory = ({location: {query}}) => (
  <DirectorySearch term={query.term} />
)

export const PostDetails = ({params}) => (
  <_PostDetails topicId={params.channelId} postId={params.postId} />
)
PostDetails.propTypes = {
  params: React.PropTypes.shape({
    channelId: React.PropTypes.string.isRequired,
    postId: React.PropTypes.string.isRequired
  }).isRequired
}

export const GroupChannelAddMembers = ({params}) => (
  <AddFollowers topicId={params.channelId} />
)
GroupChannelAddMembers.propTypes = {
  params: React.PropTypes.shape({
    channelId: React.PropTypes.string.isRequired
  }).isRequired
}
