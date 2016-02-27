import AmplitudeService from '/client/lib/amplitude.service'

export default {
  search ({FlowRouter}, searchTerm, isSearchingPeople) {
    AmplitudeService.track('success/search')
    if (isSearchingPeople) {
      return FlowRouter.go('directory-search', {}, { term: searchTerm })
    }
    return FlowRouter.go('search', {}, { term: searchTerm })
  },

  parseAndFetchMentions ({Meteor, MentionParser, store}, field, message) {
    if (!message) {
      return store.dispatch({ type: 'CLEAR_MENTIONS', field: field.name })
    }

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

  replaceWithMention ({MentionParser}, field, user) {
    const content = field.value
    return field.onChange(MentionParser.replaceLastMentionWithName(content, user.username))
  }
}
