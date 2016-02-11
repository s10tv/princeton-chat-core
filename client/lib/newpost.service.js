// validates new posts on client and server
export default class NewPostService {
  // if data is invalid, returns a dict with type and message
  static validateNewPost ({title, content, topics}) {
    var error = []

    if (!title) {
      error.push({
        type: 'title',
        reason: 'The subject is required.'
      })
    }

    if (!content) {
      error.push({
        type: 'content',
        reason: 'The content is required.'
      })
    }

    if (!topics) {
      error.push({
        type: 'topics',
        reason: 'You need to select at least one topic.'
      })
    }

    return error
  }
}
