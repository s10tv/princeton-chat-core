
export default {
  search ({Meteor, LocalState}, searchTerm, searchType) {
    let method
    switch (searchType) {
      case 'users':
        method = 'search/users'
        break
      case 'posts': // fallthrough intentional
      default:
        method = 'search/posts'
    }

    Meteor.call(method, searchTerm, (err, res) => {
      if (err) {
        return console.log(err)
      }

      LocalState.set('SEARCH_RESULTS', res)
    })
  }
}
