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
import {i18n as _i18n} from 'meteor/anti:i18n';

class App {
  constructor(context, actions = {}) {
    this.context = context;
    this.actions = actions;
    this._routesLoaded = false;
  }

  localize() {
    i18n.setLanguage(Meteor.settings.public.audience)
    DocHead.setTitle(i18n('title'));
    DocHead.addMeta({ property: 'description', content: i18n('ogDescription') });
    DocHead.addMeta({ property: 'fb:app_id', content: i18n('fbAppId') });
    DocHead.addMeta({ property: 'og:url', content: i18n('ogUrl') });
    DocHead.addMeta({ property: 'og:type', content: i18n('ogType') });
    DocHead.addMeta({ property: 'og:title', content: i18n('ogTitle') });
    DocHead.addMeta({ property: 'og:description', content: i18n('ogDescription') });
    DocHead.addMeta({ property: 'og:image', content: i18n('ogImage') });

    var linkInfo = {rel: "icon", type: "image/png", href: i18n('favicon')};
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
export const i18n = _i18n;
