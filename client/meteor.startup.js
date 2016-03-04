/* global FlowRouter */
// This file is sent directly to Meteor without going through Webpack
// You can initialize anything you need before your app start here

// browsersync
if (Meteor.settings.public.enableBrowserSync) {
  document.write("<script async src='http://HOST:3002/browser-sync/" +
    "browser-sync-client.2.11.1.js'><\/script>".replace("HOST", location.hostname));
}

// google analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', Meteor.settings.public.googleAnalyticsKey, 'auto');
ga('send', 'pageview');

// amplitude
(function(e,t){var n=e.amplitude||{_q:[],_iq:{}};var r=t.createElement("script");r.type="text/javascript";
  r.async=true;r.src="https://d24n15hnbwhuhn.cloudfront.net/libs/amplitude-2.9.0-min.gz.js";
  r.onload=function(){e.amplitude.runQueuedFunctions()};var i=t.getElementsByTagName("script")[0];
  i.parentNode.insertBefore(r,i);var s=function(){this._q=[];return this};function a(e){
    s.prototype[e]=function(){this._q.push([e].concat(Array.prototype.slice.call(arguments,0)));
      return this}}var o=["add","append","clearAll","set","setOnce","unset"];for(var c=0;c<o.length;c++){
    a(o[c])}n.Identify=s;var u=["init","logEvent","logRevenue","setUserId","setUserProperties","setOptOut","setVersionName","setDomain","setDeviceId","setGlobalUserProperties","identify","clearUserProperties"];
  function l(e){function t(t){e[t]=function(){e._q.push([t].concat(Array.prototype.slice.call(arguments,0)));
  }}for(var n=0;n<u.length;n++){t(u[n])}}l(n);n.getInstance=function(e){e=(!e||e.length===0?"$default_instance":e).toLowerCase();
    if(!n._iq.hasOwnProperty(e)){n._iq[e]={_q:[]};l(n._iq[e])}return n._iq[e]};e.amplitude=n;
})(window,document);

amplitude.init(Meteor.settings.public.amplitudeKey);

FlowRouter.wait()
