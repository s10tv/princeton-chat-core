import React from 'react';
import {injectDeps} from 'react-simple-di';
import {Accounts} from 'meteor/accounts-base';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount} from 'react-mounter';

import MainLayout from '../components/Layout/index.jsx';

import Onboarding from '../containers/onboard';
import TopicList from '../containers/topicList';
import Settings from '../containers/settings';
import AllTopics from '../containers/allTopics';
import PostTopic from '../containers/postTopic';
import PostDetails from '../containers/postDetails';

import {NewLayout} from '../components/Layout/index.jsx';
import LayoutMain from '/imports/modules/core/components/layout.jsx'
import PostList from '/imports/modules/core/components/post.list.jsx'
import PostSingle from '/imports/modules/core/components/post.details.jsx'
import DirectMessage from '/imports/modules/core/components/directMessage.jsx'

import WebFontLoader from 'webfontloader';

export const initRoutes = (context, actions) => {
  WebFontLoader.load({
    google: {
      families: ['Roboto']
    }
  });
  
  const MainLayoutCtx = injectDeps(context, actions)(MainLayout);

  // subscribe to some global subscriptions
  FlowRouter.subscriptions = function() {
    this.register('topicsToFollow', Meteor.subscribe('topicsToFollow'));
    this.register('publicLists', Meteor.subscribe('publicLists'));
    this.register('userData', Meteor.subscribe('userData'));
  };

  FlowRouter.route('/postlist', {
    action() {
      mount(LayoutMain, {
        content: () => <PostList />
      })
    }
  })
  
  FlowRouter.route('/postdetails', {
    action() {
      mount(LayoutMain, {
        content: (props) => <PostSingle {...props} />
      })
    }
  })
  
  FlowRouter.route('/directmessage', {
    action() {
      mount(LayoutMain, {
        content: (props) => <DirectMessage {...props} />
      })
    }
  })

  FlowRouter.route('/invite/:id', {
    name: 'onboarding',
    action({ id }) {
      Accounts.callLoginMethod({
        methodArguments: [{ invite: id }],
        userCallback: (err) => {
          if (err) {
            FlowRouter.go('test');
          }

          mount(MainLayoutCtx, {
            content: () => (<Onboarding />)
          });
        }
      });
    }
  });

  FlowRouter.route('/add-post', {
    name: 'allTopics',
    action() {
      mount(MainLayoutCtx, {
        content: () => (<PostTopic />)
      });
    }
  });

  FlowRouter.route('/all-topics', {
    name: 'allTopics',
    action() {
      mount(MainLayoutCtx, {
        content: () => (<AllTopics />)
      });
    }
  });

  FlowRouter.route('/settings', {
    name: 'settings',
    action() {
      mount(MainLayoutCtx, {
        content: () => (<Settings />)
      });
    }
  });

  FlowRouter.route('/all', {
    name: 'all',
    action() {
      mount(MainLayoutCtx, {
        content: () => (<TopicList topicId={null} trigger={'ALL'} />)
      });
    }
  });

  FlowRouter.route('/all-mine', {
    name: 'all-mine',
    action() {
      mount(MainLayoutCtx, {
        content: () => (<TopicList topicId={null} trigger={'ALL_MINE'}/>)
      });
    }
  });

  FlowRouter.route('/topics/:topicId/:postId', {
    name: 'detail-topics',
    action({ postId, topicId }) {
      mount(MainLayoutCtx, {
        content: () => (<PostDetails topicId={topicId} postId={postId} />)
      });
    }
  });

  FlowRouter.route('/topics/:topicId', {
    name: 'topic',
    action({ topicId }) {
      mount(MainLayoutCtx, {
        content: () => (<TopicList topicId={topicId} />)
      });
    }
  });
};
