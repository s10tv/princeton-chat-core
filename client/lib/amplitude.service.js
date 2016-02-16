export default class AmplitudeService {
  static setUpAfterSignup ({Meteor}) {
    const user = Meteor.user()
    if (user) {
      amplitude.setUserId(Meteor.userId())

      if (user.emails && user.emails[0]) {
        amplitude.setUserProperties({
          email: user.emails[0].address
        })
      }
    }
  }

  static track (event) {
    amplitude.logEvent(event)
  }
}
