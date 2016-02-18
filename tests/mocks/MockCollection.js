const {LocalCollection} = require('./minimongo.js');

export default {
  Invites: new LocalCollection(),
  Posts: new LocalCollection(),
  Messages: new LocalCollection(),
  Users: new LocalCollection()
}