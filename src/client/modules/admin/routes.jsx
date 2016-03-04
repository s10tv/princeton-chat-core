import React from 'react'

import {mount} from 'react-mounter'
import LayoutMain from 'client/modules/core/containers/layout.js'
import AdminInvite from './containers/admin.invite.js'

export default function (injectDeps, {FlowRouter, Meteor}) {
  const LayoutMainCtx = injectDeps(LayoutMain)

  const adminRoutes = FlowRouter.group({
    prefix: '/admin',
    name: 'admin'
  })

  adminRoutes.route('/invite', {
    name: 'admin-invite',
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    action: () => {
      mount(LayoutMainCtx, {
        content: (props) => <AdminInvite {...props} />
      })
    }
  })
}
