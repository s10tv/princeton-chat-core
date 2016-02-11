// validates new topics on client and server
export default class NewTopicService {
  static validateTopicName (name) {
    if (!name) {
      return {
        reason: 'Topic name is required'
      }
    }

    if (name.length > 21) {
      return {
        reason: 'Topic names need to be shorter than 21 characters'
      }
    }

    var reSymbol = /[!$%^&*()+|~=`{}\[\]:";'<>?,.\/]/
    var prohibitedSymbolArr = name.match(reSymbol)
    if (prohibitedSymbolArr !== null) {
      const prohibitedSymbol = prohibitedSymbolArr[0]
      return {
        reason: `You can't have ${prohibitedSymbol} in the name!`
      }
    }

    if (name.indexOf(' ') !== -1) {
      return {
        reason: `You can't have spaces in the name!`
      }
    }

    var reUppercase = /[A-Z]/
    if (reUppercase.test(name)) {
      return {
        reason: 'Topic names should be lowercase'
      }
    }

    return {}
  }

  static validateTopicDescription (description) {
    if (!description) {
      return {
        reason: 'Topic description is required'
      }
    }

    if (!description > 200) {
      return {
        reason: 'Topic descriptions need to be shorter than 200 characters'
      }
    }

    return {}
  }
}
