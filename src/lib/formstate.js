'use strict'

import { P } from 'patchinko'
import stream from './stream'

import dayjs from 'dayjs'

//
// Field state.
//
// Has two inputs sreams of data
//
// - value (from backend)
// - text (from user)
//
// goes through
// - validation (of input)
// - parsing (of input)
// - formatting (of value)
//
// and produces output stream of
// - value (to backend)
// - text (to user)
// - error (to user)
//
export class FieldState {
  constructor (opts) {
    this.validator = ensureArray(opts.validator || [])
    this.parser = opts.parser
    this.formatter = opts.formatter
    // the two input streams
    this.value = stream()
    this.text = stream()

    this.value.on(v => this._updateValue(v))
    this.text.on(t => this._updateText(t))
    this.patch = stream()
    this.state = this.patch.scan((s, p) => P({}, s, p), {})
    this.value(opts.value)
  }

  _updateValue (value) {
    // new value supplied, so format text accordingly
    const text = this.formatter ? this.formatter(value) : String(value)
    this.patch({ error: '', value, text, dirty: false })
  }

  _updateText (text) {
    // new text value supplied, so add it, and queue validation
    this.patch({ text, dirty: true })
    this.validate()
  }

  // can be called by user - async validate and updates status
  // message
  //
  // returns true if valid
  validate () {
    return Promise.resolve().then(() => {
      let text = this.state().text || ''
      let error = ''
      this.validator.find(f => {
        error = f(text)
        return !!error
      })
      if (!error) {
        const value = this.parser ? this.parser(text) : text
        text = this.formatter ? this.formatter(value) : String(value)
        this.patch({ error, value, text })
        return false
      } else {
        this.patch({ error, text })
        return true
      }
    })
  }
}

export class FormState {
  constructor (fields) {
    this.$ = fields
    this.state = stream
      .combine(
        this._updateState.bind(this),
        Object.values(fields).map(f => f.state)
      )
      .dedupeWith(stream.shallow)
  }

  _updateState () {
    return Object.values(this.$).reduce(
      ({ error, dirty }, fld) => ({
        error: error || fld.state().error,
        dirty: dirty || fld.state().dirty
      }),
      { error: '', dirty: false }
    )
  }

  validate () {
    // force validation of current text value for all
    // fields by re-pushing the text value into the
    // stream
    return Promise.all(Object.values(this.$).map(fld => fld.validate())).then(
      () => !this.state().error
    )
  }

  set (data) {
    Object.entries(this.$).forEach(([k, fld]) => fld.value(data[k]))
  }

  getChanges () {
    return Object.entries(this.$).reduce((o, [k, fld]) => {
      const { dirty, value } = fld.state()
      if (dirty) o[k] = value
      return o
    }, {})
  }

  getValues () {
    return Object.entries(this.$).reduce((o, [k, fld]) => {
      o[k] = fld.state().value
      return o
    }, {})
  }
}

function ensureArray (o) {
  return Array.isArray(o) ? o : [o]
}

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
