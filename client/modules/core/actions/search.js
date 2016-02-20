
export default {
  search ({FlowRouter}, searchTerm, isSearchingPeople) {
    if (isSearchingPeople) {
      return FlowRouter.go('directory-search', {}, { term: searchTerm })
    }
    return FlowRouter.go('search', {}, { term: searchTerm })
  }
}
