import moment from 'moment';

export default class DateFormatter {

  // The doc must have `createdAt` (should be attached directly by meteor)
  static format(doc) {
    return moment(doc.createdAt).format("M/D h:mm a")
  }

}
