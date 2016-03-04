import AmplitudeService from '/src/client/lib/amplitude.service'
import postfollowers from './postfollowers'

function arraysEqual (a, b) {
  if (a === b) return true
  if (a == null || b == null) return false
  if (a.length !== b.length) return false

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false
  }
  return true
}

function updateMentionedUsers (context, message) {
  const {MentionParser, store} = context
  // TODO: This hits our server every time, which is inefficient. If this becomes an
  // issue we will address it later.
  const mentionedUsernames = MentionParser.parseMentions(message)
  const {currentlyMentionedUsernames} = store.getState().core
  if (!arraysEqual(currentlyMentionedUsernames, mentionedUsernames)) {
    store.dispatch({
      type: 'REPLACE_CURRENLY_MENTIONED',
      currentlyMentioned: mentionedUsernames
    })
    postfollowers.updateMentionFollowers(context, mentionedUsernames)
  }
}

export default {
  search ({FlowRouter}, searchTerm, isSearchingPeople) {
    AmplitudeService.track('success/search')
    if (isSearchingPeople) {
      return FlowRouter.go('directory-search', {}, { term: searchTerm })
    }
    return FlowRouter.go('search', {}, { term: searchTerm })
  },

  parseAndFetchMentions (context, field, message) {
    const {Meteor, MentionParser, store} = context
    if (!message) {
      return store.dispatch({ type: 'CLEAR_MENTIONS', field: field.name })
    }

    updateMentionedUsers(context, message)

    // parse mention of last word. If is a mention, then issue meteor call
    const mentions = MentionParser.getMentionForLastWord(message)
    if (mentions.length === 0) {
      return store.dispatch({ type: 'CLEAR_MENTIONS', field: field.name })
    }

    const lastMention = mentions[mentions.length - 1]
    Meteor.call('search/users', lastMention.substring(1), (err, res) => {
      if (err) {
        return console.error('Error in search/users', err)
      }

      return store.dispatch({
        type: 'FETCH_MENTIONS',
        field: field.name,
        mentions: res
      })
    })
  },

  clearMentions ({store}, field) {
    store.dispatch({type: 'CLEAR_MENTIONS', field: field.name})
  },

  replaceWithMention (context, field, user) {
    const {MentionParser} = context
    const content = field.value
    const newContent = MentionParser.replaceLastMentionWithName(content, user.username)
    updateMentionedUsers(context, newContent)
    field.onChange(newContent)
  }
}
