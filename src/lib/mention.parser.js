export default class MentionParser {
  constructor ({ Collections }) {
    this.Collections = Collections
  }

  getMentionForLastWord (content) {
    const splitted = content.split(/[ \r\n]+/)
    if (splitted.length === 0) {
      return false
    }

    const lastWord = splitted[splitted.length - 1]
    return this.parseMentions(lastWord)
  }

  replaceLastMentionWithName (content, mentionName) {
    const start = content.lastIndexOf('@')
    return `${content.substring(0, start)}@${mentionName}`
  }

  // http://stackoverflow.com/questions/15265605/how-to-pull-mentions-out-of-strings-like-twitter-in-javascript
  parseMentions (content) {
    const regex = /\B@[a-z0-9_-]+/gi
    return content.match(regex) || []
  }

  fetchAllMentionedUsers (content) {
    const {Users} = this.Collections
    return this.parseMentions(content).map((mentionWord) => {
      return Users.findOne({
        username: mentionWord.substring(1)
      })
    }).filter((user) => user !== undefined)
  }
}
