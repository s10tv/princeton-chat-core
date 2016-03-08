export default class FakeEmail {

  send ({
      from,
      to,
      subject,
      html }) {
    console.log('Sent an email from ' + from + ' to ' + to + ' with subject ' + subject)
  }

}
