const MAX_NUMBER_DOCS_RETURNED = 10

export default class SearchService {
  constructor ({ Meteor, Collections }) {
    this.Meteor = Meteor
    this.Collections = Collections
  }

  searchUsers (input) {
    const { Users } = this.Collections
    var re = new RegExp(input, 'i')
    return Users.find({ status: 'active', $or: [
        { username: re },
        { emails: { $elemMatch: { address: re } } },
        { firstName: re },
        { lastName: re }
    ]}, {limit: MAX_NUMBER_DOCS_RETURNED})
  }

  searchByUsername (input) {
    const { Users } = this.Collections
    var re = new RegExp(`^${input}`, 'i')
    return Users.find({
      status: 'active',
      username: re
    }, {limit: MAX_NUMBER_DOCS_RETURNED})
  }

  searchPosts (input) {
    const { Posts } = this.Collections
    var re = new RegExp(input, 'i')
    return Posts.find({ isDM: { $ne: true }, $or: [
      { title: re },
      { content: re }
    ]}, {limit: MAX_NUMBER_DOCS_RETURNED})
  }
}
