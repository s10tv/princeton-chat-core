var SendBird,isLeavingPage=!1;$(window).unload(function(){isLeavingPage=!0}),SendBird=function(e){function n(e,n,s,t,i){i=i||!1,$.ajax({"method":"POST","url":e,"contentType":"text/plain;charset=utf-8","data":JSON.stringify(n),"async":i}).success(function(e){s(e)}).fail(function(e,n,s){t(e,n,s)})}function s(e){return h+"v"+v.replace(/[^(0-9)]/gi,"")+"/"+e}var t,i,a,c,o,r,u,l,g,d,p,f,_,y=this,m=!1,v="1",S="wss://ws.jiver.co:9010",h="https://api.jiver.co/",M=null,k={"MESG":"MESG","FILE":"FILE","LOGI":"LOGI","JOIN":"JOIN","SYSM":"SYSM","BRDM":"BRDM","MCUP":"MCUP","TPST":"TPST","TPEN":"TPEN","PING":"PING","PONG":"PONG"},F={},T={},x=0,N=0,P=null,O=null,b=null,I=0,R=!1,L=0,E=1e4,C=function(e,n){switch(e){case k.MESG:y.events.onMessageReceived(JSON.parse(n));break;case k.SYSM:y.events.onSystemMessageReceived(JSON.parse(n));break;case k.FILE:y.events.onFileMessageReceived(JSON.parse(n));break;case k.BRDM:y.events.onBroadcastMessageReceived(JSON.parse(n));break;case k.MCUP:y.events.onMessagingChannelUpdateReceived(JSON.parse(n));break;case k.TPST:y.events.onTypeStartReceived(JSON.parse(n));break;case k.TPEN:y.events.onTypeEndReceived(JSON.parse(n));break;case k.PONG:t(k.PONG);break;default:y.events.onUndefinedMessageReceived(e,JSON.parse(n))}return JSON.parse(n)},D={"successFunc":function(){},"errorFunc":function(e,n,s){console.log(e),console.log(n),console.log(s)},"async":!1};y.events={"onMessageReceived":function(e){console.log(e)},"onSystemMessageReceived":function(e){console.log(e)},"onFileMessageReceived":function(e){console.log(e)},"onBroadcastMessageReceived":function(e){console.log(e)},"onMessagingChannelUpdateReceived":function(e){console.log(e)},"onTypeStartReceived":function(e){console.log(e)},"onTypeEndReceived":function(e){console.log(e)},"onUndefinedMessageReceived":function(e,n){t(e),t(n)}},t=function(e){m&&console.log(e)},i=function(e){var i,a,c;t("=== Start SendBird SDK ==="),i=$.extend({},D,e),a="guest_login/",c={"guest_id":F.guest_id,"app_id":F.app_id,"nickname":F.user_name,"image_url":F.image_url,"access_token":F.access_token},n(s(a),c,function(e){var n={};e.error?(n={"code":e.code,"error":!0,"message":e.message},i.successFunc(n)):(F.guest_key=e.key,n={"error":!1},i.successFunc(n))},function(e,n,s){i.errorFunc(e,n,s)},i.async)},y.joinChannel=function(e,i){var a,c,o,r;t("=== Join Channel ==="),a=$.extend({},D,i),c="channel_join/",o={"app_id":F.app_id,"session_key":F.guest_key,"channel_url":e},r={},n(s(c),o,function(e){$.extend(T,e),r=T,a.successFunc(r)},function(e,n,s){a.errorFunc(e,n,s)},a.async)},y.leaveChannel=function(e,i){var a,c,o,r;t("=== Leave Channel ==="),a=$.extend({},D,i),c="channel_leave",o={"app_id":F.app_id,"session_key":F.guest_key,"channel_url":e},r={},n(s(c),o,function(e){r=e,a.successFunc(r)},function(e,n,s){a.errorFunc(e,n,s)},a.async)},y.getMemberList=function(e,i){var a,c,o,r;t("=== Member List ==="),a=$.extend({},D,i),c="member_list/",o={"app_id":F.app_id,"channel_url":e},r={},n(s(c),o,function(e){r=e,a.successFunc(r)},function(e,n,s){a.errorFunc(e,n,s)},a.async)},y.getChannelSearch=function(e){var i,a,c,o;t("=== Channel List ==="),e=$.extend({},{"limit":20,"page":1,"query":""},e),i=$.extend({},D,e),a="channel_list/",c={"app_id":F.app_id,"page":i.page,"limit":i.limit,"query":i.query},o={},n(s(a),c,function(e){o=e,i.successFunc(o)},function(e,n,s){i.errorFunc(e,n,s)},i.async)},y.joinMessagingChannel=function(e,i){var a,c,o,r;t("=== Join Messaging Channel ==="),a=$.extend({},D,i),c="messaging_join/",o={"app_id":F.app_id,"session_key":F.guest_key,"channel_url":e},r={},n(s(c),o,function(e){$.extend(T,e.channel),r=e,a.successFunc(r)},function(e,n,s){a.errorFunc(e,n,s)},a.async)},y.startMessaging=function(e,i){var a,c,o,r;t("=== Start Messaging ==="),e=e instanceof Array?e:Array(e),a=$.extend({},D,i),c="messaging_start/",o={"app_id":F.app_id,"session_key":F.guest_key,"guest_ids":e},r={},n(s(c),o,function(e){$.extend(T,e.channel),r=e,a.successFunc(r)},function(e,n,s){a.errorFunc(e,n,s)},a.async)},y.inviteMessaging=function(e,i){var a,c,o,r;t("=== Invite Messaging ==="),e=e instanceof Array?e:Array(e),a=$.extend({},D,i),c="messaging_invite/",o={"app_id":F.app_id,"session_key":F.guest_key,"channel_url":T.channel_url,"guest_ids":e},r={},n(s(c),o,function(e){$.extend(T,e.channel),r=e,a.successFunc(r)},function(e,n,s){a.errorFunc(e,n,s)},a.async)},y.endMessaging=function(e,i){var a,c,o,r;t("=== End Messaging ==="),a=$.extend({},D,i),c="messaging_end/",o={"app_id":F.app_id,"session_key":F.guest_key,"channel_url":e},r={},n(s(c),o,function(e){$.extend(T,e),r=e,a.successFunc(r)},function(e,n,s){a.errorFunc(e,n,s)},a.async)},y.getMessagingChannelList=function(e){var i,a,c,o;t("=== Messaging Channel List ==="),e=$.extend({},{"limit":9999,"page":1},e),i=$.extend({},D,e),a="messaging_list/",c={"app_id":F.app_id,"session_key":F.guest_key,"page":i.page,"limit":i.limit},o={},n(s(a),c,function(e){o=e,i.successFunc(o)},function(e,n,s){i.errorFunc(e,n,s)},i.async)},y.getMessagingChannelInfo=function(e,i){var a,c,o,r;t("=== Messaging Channel Info ==="),a=$.extend({},D,i),c="messaging_info/",o={"app_id":F.app_id,"session_key":F.guest_key,"channel_id":e},r={},n(s(c),o,function(e){r=e,a.successFunc(r)},function(e,n,s){a.errorFunc(e,n,s)},a.async)},y.markAsRead=function(e,i){var a,c,o,r;t("=== Message Mark As Read ==="),a=$.extend({},D,i),c="mark_as_read/",o={"app_id":F.app_id,"session_key":F.guest_key,"channel_url":e},r={},n(s(c),o,function(e){r=e,a.successFunc(r)},function(e,n,s){a.errorFunc(e,n,s)},a.async)},y.getMessageLoadMore=function(e){var i,a,c,o,r;t("=== Message Load More ==="),e=$.extend({},{"limit":20},e),i=$.extend({},D,e),a=(new Date).getTime(),c="message_list",o={"app_id":F.app_id,"session_key":F.guest_key,"channel_url":T.channel_url,"message_ts":0==N?a:N,"prev_limit":i.limit,"next_limit":0,"include":!1},r={},n(s(c),o,function(e){e.error?r={"messages":[]}:(r=e,$.each(r.messages,function(e,n){var s=JSON.parse(n.substring(4));0==N?N=s.ts:N>s.ts&&(N=s.ts)})),i.successFunc(r)},function(e,n,s){i.errorFunc(e,n,s)},i.async)},y.getUserList=function(e){var i,a,c;t("=== User List ==="),e=$.extend({},{"token":"","page":1,"limit":30},e),i=$.extend({},D,e),a="user_list/",c={"app_id":F.app_id,"session_key":F.guest_key,"token":i.token,"page":i.page,"limit":i.limit},n(s(a),c,function(e){i.successFunc(e)},function(e,n,s){i.errorFunc(e,n,s)},i.async)},y.sendFile=function(e,n){var s,i,a,c,o;return t("=== Upload File ==="),s=$.extend({},D,n),i="upload_file/",a='{"app_id": "'+F.app_id+'"}',c=new FormData,c.append("meta",a),c.append("file",e),o="",$.ajax({"type":"POST","url":h+"v"+v.replace(/[^(0-9)]/gi,"")+"/"+i,"data":c,"processData":!1,"contentType":!1,"async":s.async,"success":function(n){n.error?s.successFunc(n):(o={"error":!1,"url":n.url},y.sendFileURL({"url":n.url,"name":e.name,"type":e.type,"size":e.size,"custom":""}),s.successFunc(o))},"fail":function(e,n,t){s.errorFunc(e,n,t)}}),fileUrl},y.typeStart=function(){t("=== Typing Start ===");var e=(new Date).getTime();l(k.TPST,{"channel_id":T.id,"time":e}),L=e,R=!0},a=function(){t("=== Typing End ===");var e=(new Date).getTime();l(k.TPEN,{"channel_id":T.id,"time":e}),L=0,R=!1},c=setInterval(function(){var e=(new Date).getTime();R&&e-L>E&&a()},E),y.connect=function(){t("=== Web Socket Connect ==="),u(),M=new WebSocket(S),M.onopen=function(){g(F.guest_key);var e=(new Date).getTime();d(T.id,e),f(!0)},M.onmessage=function(e){var n,s,t,i;for(x=(new Date).getTime(),n=e.data.split("\n"),s=0;s<n.length;s++)0!=n[s].trim().length&&(t=n[s].substring(0,4),i=n[s].substring(4),(0!==t.trim().length||0!==i.trim().length)&&(t===k.PONG?_(!1):C(t,i)))},M.onerror=function(e){t("=== Web Socket onerror ==="),t(e),isLeavingPage||o(),f(!1),_(!1)},M.onclose=function(e){t("=== Web Socket onclose ==="),t(e),isLeavingPage||o(),f(!1),_(!1)}},y.disconnect=function(){t("=== Web Socket Disconnect ==="),r()},o=function(){null==b?(t("=== Start Reconnect ==="),b=setTimeout(function(){y.connect(),b=null,t("=== Reconnect done ===")},3e3)):t("=== Reconnect is in progress. (skip) ===")},r=function(){M&&u(),T={},N=0,P=null,O=null,b=null,I=0},u=function(){M&&(M.close(),M.onmessage=function(){},M.onopen=function(){},M.onerror=function(){},M.onclose=function(){},M=null),N=0},l=function(e,n){var s=e+JSON.stringify(n)+"\n";try{if(1!=M.readyState)return!1;M.send(s)}catch(t){return console.log(t),!1}return!0},g=function(e){l(k.LOGI,{"key":e})},d=function(e,n){l(k.JOIN,{"channel_id":e,"last_message_ts":n})},p=function(){var e=(new Date).getTime();I=e,l(k.PING,{"id":e})},f=function(e){null!=P&&(clearInterval(P),P=null),e?(t("=== Start Pinger ==="),P=setInterval(function(){var e=(new Date).getTime(),n=e-x,s=parseInt(n/1e3);s>0&&s%5==0&&(t(k.PING),p(),_(!0))},1e3)):t("=== Stop Pinger ===")},_=function(e){null!=O&&(clearInterval(O),O=null),e?(t("=== Start Watchdog ==="),O=setInterval(function(){var e=(new Date).getTime(),n=e-x,s=parseInt(n/1e3);20>s||(t("=== Watchdog Barks! ==="),f(!1),o())},4500)):t("=== Watchdog ===")},y.message=function(e){var n=l(k.MESG,{"channel_id":T.id,"message":e});n&&setTimeout(function(){a()},100)},y.sendFileURL=function(e){l(k.FILE,{"channel_id":T.id,"name":e.name,"url":e.url,"type":e.type,"size":e.size,"custom":e.custom})},Object.defineProperties(this,{"MESSAGE_CMD":{"get":function(){return k}},"printDebugMessage":{"get":function(){return m},"set":function(e){m=e}}}),F.app_id=e.app_id,F.guest_id=e.guest_id,F.user_name=e.user_name,F.image_url=void 0==e.image_url||null==e.image_url?"":e.image_url,F.access_token=void 0==e.access_token||null==e.access_token?"":e.access_token,i({"successFunc":function(n){e.successFunc(n)},"errorFunc":function(n,s,t){e.errorFunc(n,s,t)},"async":e.async})},SendBird.prototype.setDebugMessage=function(e){this.printDebugMessage=e},SendBird.prototype.commandSeparate=function(e){var n=e.substring(0,4),s=JSON.parse(e.substring(4));return{"cmd":n,"payload":s}},SendBird.prototype.isMessage=function(e){return e==this.MESSAGE_CMD.MESG},SendBird.prototype.isFileMessage=function(e){return e==this.MESSAGE_CMD.FILE},SendBird.prototype.hasImage=function(e){var n=e.url.split("."),s=n[n.length-1];return"png"==s||"jpeg"==s||"jpg"==s||"gif"==s||"bmp"==s?!0:e.type.indexOf("image")>=0},SendBird.prototype.getChannelList=function(e){return this.getChannelSearch(e)},SendBird.prototype.isGroupMessaging=function(e){return 5==e?!1:!0};

var sendbird = new SendBird({
  "app_id": '4C81A374-9EBE-4399-8A18-DADB752B4AEA',
  "guest_id": 'guest-id',
  "user_name": 'princeton-chat',
  "access_token": '',
  "successFunc": function(data) {
    console.log(data);
    // do something...
  },
  "errorFunc": function(xhr, status, error) {
    console.log(xhr, status, error);
    // do something
  },
});

sendbird.events.onMessageReceived = function(obj) {
  console.log(obj);
  // do something
};

sendbird.events.onSystemMessageReceived = function(obj) {
  console.log(obj);
  // do something...
};

sendbird.events.onFileMessageReceived = function(obj) {
  console.log(obj);
  // do something...
};

sendbird.events.onBroadcastMessageReceived = function(obj) {
  console.log(obj);
  // do something...
};

sendbird.events.onMessagingChannelUpdateReceived = function(obj) {
  console.log(obj);
  // do something...
};


sendbird.events.onTypeStartReceived = function(obj) {
  console.log(obj);
  // do something...
}

sendbird.events.onTypeEndReceived = function(obj) {
  console.log(obj);
  // do something...
}

sendbird.joinChannel(
  '60f52.general',
  {
    "successFunc" : function(data) {
      console.log(data);
      sendbird.connect();
      // do something
    },
    "errorFunc": function(xhr, status, error) {
      console.log(xhr, status, error);
      // do something
    },
  }
);

export default sendbird;
