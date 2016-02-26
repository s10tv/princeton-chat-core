export default class MentionParser {
  constructor ({ Collections }) {
    this.Collections = Collections
  }

  parseMentions (content) {
    const {Users} = this.Collections
    return content.split(' ').map((word) => {
      if (word.length === 0) {
        return undefined
      }

      return Users.findOne({
        username: word.indexOf(1)
      })
    }).filter((user) => user !== undefined)
  }
}
