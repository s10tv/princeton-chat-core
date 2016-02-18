class MockMeteorError extends Error {
  constructor(code, reason) {
    super(`${code}: ${reason}`)
  }
}

export default class MockMeteor {

  constructor() {
    // configurable
    this.currentUser = null;

    // not configurable
    this.calls = []
    this._methods = {}
    this.Error = MockMeteorError
  }

  methods(args) {
    this._methods = args
  }

  call(methodName, ...args) {
    this.calls.push({
      methodName,
      args: args
    })

    const method = this._methods[methodName]
    if (method) {
      return method(...args)
    }
    return undefined
  }

  user() {
    return this.currentUser
  }
}