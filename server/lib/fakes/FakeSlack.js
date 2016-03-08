export default class FakeSlack {

  send ({
      icon_emoji,
      text,
      username }) {
    console.log('Sent Slack notification with this text: ' + text)
  }

}
