import {
  injectDeps,
  useDeps as _useDeps
} from 'react-simple-di';

import {
  compose as _compose,
  composeWithTracker as _composeWithTracker,
  composeWithPromise as _composeWithPromise,
  composeWithObservable as _composeWithObservable,
  composeAll as _composeAll
} from 'react-komposer';

import { DocHead } from 'meteor/kadira:dochead';

// custom enviornment variables
import Env from './deployments'

class App {
  constructor(context, actions = {}) {
    this.context = context;
    this.actions = actions;
    this._routesLoaded = false;
  }

  localize() {
    const audience = Meteor.settings.public.audience || 'princeton'
    const env = Env[audience]

    DocHead.setTitle(env.title);
    DocHead.addMeta({ property: 'description', content: env.ogDescription });
    DocHead.addMeta({ property: 'fb:app_id', content: env.fbAppId });
    DocHead.addMeta({ property: 'og:url', content: env.ogUrl });
    DocHead.addMeta({ property: 'og:type', content: env.ogType });
    DocHead.addMeta({ property: 'og:title', content: env.ogTitle });
    DocHead.addMeta({ property: 'og:description', content: env.ogDescription });
    DocHead.addMeta({ property: 'og:image', content: env.ogImage });

    var linkInfo = {rel: "icon", type: "image/png", href: env.favicon};
    DocHead.addLink(linkInfo);
  }

  loadRoutes(routes) {
    const inject = (comp) => {
      return injectDeps(this.context, this.actions)(comp);
    };

    routes(inject, this.context, this.actions);
    this._routesLoaded = true;
  }

  loadModule(module) {
    if (this._routesLoaded) {
      const message = `A module should be loaded before loading routes.`;
      throw new Error(message);
    }

    if (!module) {
      const message = `app.loadModule() should be called with a module`;
      throw new Error(message);
    }

    if (typeof module.load !== 'function') {
      const message = `A module must contain a .load() function.`;
      throw new Error(message);
    }

    const actions = module.actions || {};
    this.actions = {
      ...this.actions,
      ...actions
    };

    module.load(this.context);
  }
}

// export this module's functions
export const createApp = (...args) => (new App(...args));

// export react-simple-di functions
export const useDeps = _useDeps;

// export react-komposer functions
export const compose = _compose;
export const composeWithTracker = _composeWithTracker;
export const composeWithPromise = _composeWithPromise;
export const composeWithObservable = _composeWithObservable;
export const composeAll = _composeAll;

export const i18n = (tag) => {
  const audience = Meteor.settings.public.audience || 'princeton'
  return Env[audience][tag]
}
