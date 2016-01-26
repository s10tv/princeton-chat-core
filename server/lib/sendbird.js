class SendBird {

  constructor(options = {}) {
    this.token = options.token || '5a9c876178254733a1443536cef570a19ab583b8';
  }

  createChannel(post) {
    const endpoint = 'https://api.sendbird.com/channel/create';
    const options = {
      "auth": `C35980DD-FEE9-49F6-90FA-5D429B26019B:${this.token}`,
      "channel_url": post._id,
      "name": post.title,
      "cover_url": '',
      "data": post._id,
    };

    console.log(options);

    const result = HTTP.call("POST", endpoint, options);
    console.log(result);
  }
}

this.SendBird = SendBird;
