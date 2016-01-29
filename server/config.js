ServiceConfiguration.configurations.remove({
  service: 'facebook'
});

ServiceConfiguration.configurations.insert({
  service: 'facebook',
  appId: process.env.FB_APP_ID || '1687343324838305',
  secret: process.env.FB_APP_SECRET || '8bc99973abd08ad512642ea8c84d1bdb',
});

ServiceConfiguration.configurations.remove({
   service: "instagram"
 });

ServiceConfiguration.configurations.insert({
   service: "instagram",
   clientId: process.env.INSTAGRAM_ID || '8ec6615feaf24a18baaec4a3448f5eec',
   secret: process.env.INSTAGRAM_SECRET || '51dd6c59fe06453391997df4e4332273',
   scope: 'basic',
 });

Accounts.validateNewUser((user) => {
  throw new Meteor.Error(403, "You haven't registered yet. Register first at https://princeton.chat")
  return false
})
