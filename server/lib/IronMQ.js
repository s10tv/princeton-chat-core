const Future = Npm.require('fibers/future');
const Iron = Meteor.npmRequire('iron_mq');

class IronMQ {

  constructor(queueName) {
    check(queueName, String);

    this.queueName = queueName;

    const creds = {
      token: process.env.IRON_MQ_TOKEN,
      project_id: process.env.IRON_MQ_PROJECT_ID,
      host: 'mq-aws-eu-west-1-1.iron.io',
      queue_name: queueName,
    }
    this.client = new Iron.Client(creds);
  }

  send({ payload }) {
    const queue = this.client.queue(this.queueName);
    const future = new Future()
    const onComplete = future.resolver();
    queue.post(JSON.stringify(payload), onComplete);
    Future.wait(future);
    return future.get();
  }
}

this.IronMQ = IronMQ;
