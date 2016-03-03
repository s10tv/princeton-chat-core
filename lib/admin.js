export function isTopicAdmin (user, topic) {
  if (!user || !topic) {
    return false
  }

  if (topic.ownerId === user._id) {
    return true
  }

  return isAdmin(user) || (user.topicAdmins && user.topicAdmins.indexOf(topic._id) >= 0)
}

export function isAdmin (user) {
  return user.topicAdmins && user.topicAdmins.indexOf('global') >= 0
}
