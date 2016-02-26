
export default {
  search ({FlowRouter}, searchTerm, isSearchingPeople) {
    if (isSearchingPeople) {
      return FlowRouter.go('directory-search', {}, { term: searchTerm })
    }
    return FlowRouter.go('search', {}, { term: searchTerm })
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
