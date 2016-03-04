import {mount} from 'react-mounter'

import AmaDetails from 'client/modules/ama/containers/ama.details'

export default function (injectDeps, {FlowRouter}) {
  var AmaRouter = FlowRouter.group({
    prefix: '/ama',
    name: 'ama'
  })
  AmaRouter.route('/:id', {
    name: 'ama-details',
    action () {
      mount(injectDeps(AmaDetails))
    }
  })
}
