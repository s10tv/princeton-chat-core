import React from 'react';
import {injectDeps} from 'react-simple-di';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount} from 'react-mounter';

import LayoutMain from '../modules/core/components/layout.jsx'
import PostList from '../modules/core/components/post.list.jsx'
import PostSingle from '../modules/core/components/post.details.jsx'

import WebFontLoader from 'webfontloader';

export default function (injectDeps) {
  WebFontLoader.load({
    google: {
      families: ['Roboto']
    }
  });

  const LayoutMainCtx = injectDeps(LayoutMain);

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
  });

  FlowRouter.route('/postdetails', {
    action() {
      mount(LayoutMain, {
        content: (props) => <PostSingle {...props} />
      })
    }
  });
}
