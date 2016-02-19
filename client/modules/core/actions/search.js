
export default {
  search ({FlowRouter}, searchTerm) {
    return FlowRouter.go('search', {}, { term: searchTerm })
  }
}
