export default class SearchService {
  constructor ({ Meteor, Collections }) {
    this.Meteor = Meteor
    this.Collections = Collections
  }

  searchUsers ({input}) {
    const { Users } = this.Collections
    var re = new RegExp(input)
    return Users.find({ status: 'active', $or: [
        { username: re },
        { email: re },
        { firstName: re },
        { lastName: re }
    ]})
  }

  searchPosts ({input}) {
    const { Posts } = this.Collections
    var re = new RegExp(input)
    return Posts.find({ $or: [
      { title: re },
      { content: re }
    ]})
  }
}
