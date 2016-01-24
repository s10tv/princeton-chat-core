import moment from 'moment';

export default class DateFormatter {

  // The doc must have `createdAt` (should be attached directly by meteor)
  static getTimestamp(doc) {
    return moment(doc.createdAt).format("MMM Do YYYY, h:mm:ss a")
  }

}
