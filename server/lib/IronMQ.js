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
    console.log('ironmq sending', this.queueName, payload );

    const queue = this.client.queue(this.queueName);


    const info = new Future();
    const infoComplete = info.resolver();
    this.client.queues({}, infoComplete);
    Future.wait(info);
    console.log(info.get());

    const f = new Future();
    const fComplete = f.resolver();
    queue.info(fComplete);
    Future.wait(f);
    console.log(f.get());

    const future = new Future()
    const onComplete = future.resolver();
    queue.post(payload, onComplete);
    Future.wait(future);
    return future.get();
  }
}

this.IronMQ = IronMQ;
