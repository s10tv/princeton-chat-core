
export default {
  search ({FlowRouter}, searchTerm, isSearchingPeople) {
    if (isSearchingPeople) {
      return FlowRouter.go('directory-search', {}, { term: searchTerm })
    }
    return FlowRouter.go('search', {}, { term: searchTerm })
  },

  fetchMentions({Meteor}, term, callback) {
    console.log('searching for ', term)
    Meteor.call('search/users', term, (err, res) => {
      return callback(res)
    })
  }
}
