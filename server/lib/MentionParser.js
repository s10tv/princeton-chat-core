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

      if (word.charAt(0) !== '@') {
        return
      }

      return Users.findOne({
        username: word.substring(1)
      })
    }).filter((user) => user !== undefined)
  }
}
