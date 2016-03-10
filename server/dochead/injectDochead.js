import {Meteor} from 'meteor/meteor'
import {WebApp} from 'meteor/webapp'
import {RoutePolicy} from 'meteor/routepolicy'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import {match, RouterContext} from 'react-router'
import Helmet from 'react-helmet'

// meteor algorithm to check if this is a meteor serving http request or not
const IsAppUrl = (url) => {
  if (url === '/favicon.ico' || url === '/robots.txt') {
    return false
  }
  // NOTE: app.manifest is not a web standard like favicon.ico and
  // robots.txt. It is a file name we have chosen to use for HTML5
  // appcache URLs. It is included here to prevent using an appcache
  // then removing it from poisoning an app permanently. Eventually,
  // once we have server side routing, this won't be needed as
  // unknown URLs with return a 404 automatically.
  if (url === '/app.manifest') {
    return false
  }
  // Avoid serving app HTML for declared routes such as /sockjs/.
  if (RoutePolicy.classify(url)) {
    return false
  }
  return true
}

const patchResWrite = (originalWrite, head) => {
  return function (data) {
    if (typeof data === 'string' && data.indexOf('<!DOCTYPE html>') === 0) {
      // Add react-helmet stuff in the header (yay SEO!)
      data = data.replace('<head>',
        `<head>${head.title}${head.base}${head.meta}${head.link}${head.script}`)
      // '<head>' + head.title + head.base + head.meta + head.link + head.script
    }
    originalWrite.call(this, data)
  }
}

export default Meteor.bindEnvironment((routes) => {
  console.log('Will inject dochead handler into Meteor')
  WebApp.connectHandlers.use(Meteor.bindEnvironment((req, res, next) => {
    if (!IsAppUrl(req.url)) {
      return next()
    }

    match({routes, location: req.url}, Meteor.bindEnvironment((err, redirectLocation, renderProps) => {
      if (!err && !redirectLocation && renderProps) {
        console.log('Will patch res.write with dochead info url =', req.url)
        ReactDOMServer.renderToStaticMarkup(React.createElement(RouterContext, renderProps))
        const head = Helmet.rewind()
        res.write = patchResWrite(res.write, head)
      }
      next()
    }))
  }))
})
