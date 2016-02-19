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
    ]}).fetch()
  }

  searchPosts (input) {
    const { Posts } = this.Collections
    var re = new RegExp(input, 'i')
    return Posts.find({ $or: [
      { title: re },
      { content: re }
    ]}).fetch()
  }
}
