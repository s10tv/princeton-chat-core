import AmplitudeService from '/client/lib/amplitude.service'

export default {
  search ({FlowRouter}, searchTerm, isSearchingPeople) {
    AmplitudeService.track('success/search')
    if (isSearchingPeople) {
      return FlowRouter.go('directory-search', {}, { term: searchTerm })
    }
    return FlowRouter.go('search', {}, { term: searchTerm })
  },

  parseAndFetchMentions ({Meteor, store}, field, message) {
    if (!message) {
      return store.dispatch({ type: 'CLEAR_MENTIONS', field: field.name })
    }

    const words = message.split(' ').filter((word) => word.length > 0)
    if (words.length === 0) {
      return store.dispatch({ type: 'CLEAR_MENTIONS', field: field.name })
    }

    const lastWord = words[words.length - 1]

    if (lastWord.charAt(0) === '@' && lastWord.length > 1) {
      Meteor.call('search/users', lastWord.substring(1), (err, res) => {
        if (err) {
          return console.error('Error in search/users', err)
        }

        return store.dispatch({
          type: 'FETCH_MENTIONS',
          field: field.name,
          mentions: res
        })
      })
    } else {
      return store.dispatch({ type: 'CLEAR_MENTIONS', field: field.name })
    }
  },

  clearMentions ({store}, field) {
    store.dispatch({type: 'CLEAR_MENTIONS', field: field.name})
  },

  replaceWithMention (context, field, user) {
    const currentVal = field.value
    const words = currentVal.split(' ').filter((word) => word.length > 0)
    if (words.length > 0) {
      words.pop()
    }
    words.push(`@${user.username} `)

    return field.onChange(words.join(' '))
  },

  fetchMentions ({Meteor}, term, callback) {
    Meteor.call('search/users', term, (err, res) => {
      if (err) {
        return callback([])
      }
      return callback(res)
    })
  }
}
