export default class MentionParser {
  constructor ({ Collections }) {
    this.Collections = Collections
  }

  isMention (word) {
    if (!word) {
      return false
    }

    if (typeof word !== 'string') {
      return false
    }

    if (word.length === 0) {
      return false
    }

    return word.charAt(0) === '@'
  }

  parseMentions (content) {
    const {Users} = this.Collections
    return content.split(' ').map((word) => {
      if (word.length === 0) {
        return undefined
      }

      if (!this.isMention(word)) {
        return
      }

      return Users.findOne({
        username: word.substring(1)
      })
    }).filter((user) => user !== undefined)
  }
}
