'use strict'

import h from '../lib/hyperscript'

import { actions } from '../store'
import defer from '../lib/defer'

const NewMember = {
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
  render: () => <div />
}
export default NewMember
