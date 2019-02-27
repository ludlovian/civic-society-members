'use strict'

import dayjs from 'dayjs'

export const validators = {
  required: val => !val.trim() && 'Value required',
  email: val => !/.+@.+\..+/i.test(val) && 'Enter a valid email address',
  date: val => !dayjs(val).isValid() && 'Enter a valid date',
  currency: val =>
    !/^£?(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d{0,2})?$/.test(val) &&
    'Enter a valid amount'
}

export const formatters = {
  date: v => dayjs(v).format('YYYY-MM-DD'),
  currency: v =>
    v.toLocaleString(undefined, { style: 'currency', currency: 'GBP' }),
  boolean: v => String(v)
}

export const parsers = {
  date: txt =>
    dayjs(txt)
      .startOf('day')
      .toDate(),
  currency: txt => parseFloat(txt.toString().replace(/[£,]/g, '')),
  boolean: txt => ({ '': '', true: true, false: false }[txt])
}
