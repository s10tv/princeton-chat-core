import React from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount} from 'react-mounter';

import LayoutMain from '../modules/core/components/layout.jsx'
import PostList from '../modules/core/containers/post.list.js'
import PostSingle from '../modules/core/containers/post.details.js'
import DirectMessage from '../modules/core/components/directMessage.jsx'
import TopicList from '../modules/core/components/topic.list.jsx'

import Login from '../modules/core/components/login.jsx'

import WebFontLoader from 'webfontloader';

function requireLogin(context) {
  if (!Meteor.user()) {
    return FlowRouter.go('home');
  }
}

export default function (injectDeps) {
  WebFontLoader.load({
    google: {
      families: ['Roboto']
    }
  });

  const LayoutMainCtx = injectDeps(LayoutMain);

  FlowRouter.triggers.enter([requireLogin], {except: ["home"]});

  FlowRouter.subscriptions = function() {
    this.register('topicsToFollow', Meteor.subscribe('topicsToFollow'));
    this.register('userData', Meteor.subscribe('userData'));
  };

  FlowRouter.route('/', {
    name: 'home',
    action() {
      mount(Login);
    }
  });

  FlowRouter.route('/topics/:topicId', {
    name: 'postList',
    action({ topicId }) {
      mount(LayoutMainCtx, {
        content: () => <PostList topicId={topicId} />
      })
    }
  });

  FlowRouter.route('/all-mine', {
    name: 'all-mine',
    action() {
      mount(LayoutMainCtx, {
        content: () => <PostList postListType={'ALL_MINE'} />
      })
    }
  });

  FlowRouter.route('/all', {
    name: 'all',
    action() {
      mount(LayoutMainCtx, {
        content: () => <PostList postListType={'ALL'} />
      })
    }
  });

  FlowRouter.route('/topics/:topicId/:postId', {
    name: 'postDetails',
    action({ topicId, postId }) {
      mount(LayoutMainCtx, {
        content: () => <PostSingle topicId={topicId} postId={postId} />
      })
    }
  });

  FlowRouter.route('/postdetails', {
    action() {
      mount(LayoutMainCtx, {
        content: (props) => <PostSingle {...props} />
      })
    }
  });

  FlowRouter.route('/x-directmessage', {
    action() {
      mount(LayoutMainCtx, {
        content: (props) => <DirectMessage {...props} />
      })
    }
  });

  FlowRouter.route('/x-topics', {
    action() {
      mount(LayoutMainCtx, {
        content: (props) => <TopicList {...props} />
      })
    }
  });
}
