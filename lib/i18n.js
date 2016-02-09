import AvatarService from '/imports/libs/AvatarService'

i18n.map('princeton', {
  title: 'Princeton.Chat',
  tagline: 'Better TigerNet',
  placeholderEmailDomain: 'alumni.princeton.edu',
  homePageQA: 'Should a San Francisco alumus get notified that a New York tiger listed an apartment for rent?',
  community: 'Princeton',

  // onboarding
  onboardingGreeting: 'Welcome Tiger!',
  onboardingDesc: 'Princeton.Chat is a community for Princeton alums.',

  // emails
  topicMailServer: 'topics.princeton.chat',

  // landing page
  signupPage: 'princeton',

  defaultAvatar: AvatarService.generateDefaultAvatarForAudience(process.env.AUDIENCE || 'princeton'),
});

i18n.map('s10', {
  title: 'S10.Chat',
  tagline: 'Better Private Communities',
  placeholderEmailDomain: 'gmail.com',
  homePageQA: 'Should a San Francisco resident get notified that a New Yoker listed an apartment for rent?',
  community: 'S10',

  // onboarding
  onboardingGreeting: 'Welcome to S10.Chat!',
  onboardingDesc: 'S10.Chat is a community for everyone interested in following along the development of Taylr.Chat',

  // emails
  topicMailServer: 'topics.s10.chat',

  // landing page
  signupPage: 'princeton',

  defaultAvatar: '/images/avatar-placeholder.png',
});
