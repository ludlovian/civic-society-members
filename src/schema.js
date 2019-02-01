'use strict'
export default {
  member: {
    type: [
      [ 'A1 Annual', 'Annual' ],
      [ 'A2 Joint', 'Joint' ],
      [ 'L1 Life', 'Life' ],
      [ 'L2 Life Joint', 'Joint Life' ],
      [ 'L3 Emeritus', 'Emeritus' ],
      [ 'C Corporate', 'Corporate' ]
    ],
    postType: [
      [ 'UK', 'UK post' ],
      [ 'Hand', 'Hand delivered' ],
      [ 'Foreign', 'Overseas post' ]
    ],
    giftAid: [
      [ '', '' ],
      [ 'true', 'Yes' ],
      [ 'false', 'No' ]
    ],
    usualMethod: [
      [ '', '' ],
      [ 'BACS', 'Standing order' ],
      [ 'Cheque', 'Cheque or cash' ],
      [ 'n/a', 'Not applicable' ]
    ]
  }
}
