/*global Log*/
class Logger {
  static log ({ level, message, params }) {
    Log[level]({ message, ...params })
  }
}

export default Logger
