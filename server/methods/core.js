

export class CurrentUser {
  static get () {


    const user = Meteor.user()
    if (!user) {
      throw new Meteor.Error(401, 'Unauthorized')
    }
    return user
  }
}

export default function () {

}