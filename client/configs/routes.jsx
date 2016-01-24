import React from 'react';
import {injectDeps} from 'react-simple-di';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount} from 'react-mounter';

import MainLayout from '../components/Layout.jsx';

import Onboarding from '../containers/onboard';
import TopicList from '../containers/topicList';
import Settings from '../containers/settings';
import AllTopics from '../containers/allTopics';
import PostTopic from '../containers/postTopic';

export const initRoutes = (context, actions) => {
  const MainLayoutCtx = injectDeps(context, actions)(MainLayout);

  // subscribe to some global subscriptions
  FlowRouter.subscriptions = function() {
    this.register('topicsToFollow', Meteor.subscribe('topicsToFollow'));
    this.register('publicLists', Meteor.subscribe('publicLists'));
    this.register('userData', Meteor.subscribe('userData'));
  };

  FlowRouter.route('/', {
    name: 'home',
    action() {
      mount(MainLayoutCtx, {
        content: () => (<Onboarding />)
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

  FlowRouter.route('/allTopics', {
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
    action() {
      mount(MainLayoutCtx, {
        content: () => (<TopicList topicId={null} trigger={'ALL'} />)
      });
    }
  });

  FlowRouter.route('/all-mine', {
    action() {
      mount(MainLayoutCtx, {
        content: () => (<TopicList topicId={null} trigger={'ALL_MINE'}/>)
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
