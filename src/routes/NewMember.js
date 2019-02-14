'use strict'

import { el } from '../domvm'
import { actions } from '../store'
import defer from '../lib/defer'

export default function NewMember () {
  return {
    hooks: {
      didMount () {
        defer(() => {
          const mbr = actions.members.createMember()
          actions.route.toPage(
            'member',
            { id: mbr.id, tab: 'details', edit: true },
            true
          )
        })
      }
    },
    render: () => el('div')
  }
}
