const Future = Npm.require('fibers/future');
const Iron = Meteor.npmRequire('iron_worker');

class IronWorker {

  constructor() {
    const creds = {
      token: process.env.IRON_WORKER_TOKEN,
      project_id: process.env.IRON_WORKER_PROJECT_ID,
    }
    this.client = new Iron.Client(creds);
  }

  send({ taskName, payload, options }) {
    if (!taskName) {
      throw new Error(500, 'Taskname needs to be specified for ironworker request');
    }

    const future = new Future()
    const onComplete = future.resolver();
    this.client.tasksCreate(taskName, payload, options, onComplete);
    Future.wait(future);
    return future.get();
  }
}

this.IronWorker = IronWorker;
