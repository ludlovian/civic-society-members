'use strict'

import valoo from './valoo'
import dedupe from './dedupe'

import dayjs from 'dayjs'

export
class FieldState {
  constructor (value) {
    // internal state
    this._state = valoo({})
    this._validators = []
    // .value -> .$
    this._parser = undefined
    // .$ -> value
    this._formatter = undefined
    this.notify = fn => this._state.on(dedupe(fn, dedupe.shallow))
    this.onChange = this.onChange.bind(this)
    // set the value
    this.$ = value
  }

  get $ () { return this._state().$ }
  get value () { return this._state().value }
  get error () { return this._state().error || '' }
  get dirty () { return this._state().dirty || false }
  get validated () { return this._state().validated || false }
  get hasError () { return Boolean(this.error) }

  _apply (update) { this._state({ ...this._state(), ...update }) }
  set $ (v) {
    this._apply({
      $: v,
      value: format(v, this._formatter),
      dirty: false
    })
  }

  //
  // sets the validators for this field
  //
  validators (...fns) { this._validators = fns; return this }
  parser (fn) { this._parser = fn; return this }
  formatter (fn) {
    this._formatter = fn
    this.$ = this.$ // reformat
    return this
  }

  //
  // call to explicitly validate
  //
  async validate () {
    const update = { error: '', validated: true }
    const value = this.value
    this._validators.find(fn => { update.error = fn(value) || ''; return update.error })
    if (!update.error) {
      update.$ = parse(value, this._parser)
      update.value = format(update.$, this._formatter)
    }
    this._apply(update)
  }

  //
  // should be called when the field value changes
  //
  onChange (value) {
    if (this.validated && value === this.value) return
    this._apply({ dirty: true, value })
    this.validate()
  }
}

export
class FormState {
  constructor (fields) {
    this.$ = fields
    // our own state, which is updated from the child states
    this._state = valoo(this._getState())
    this.notify = fn => this._state.on(dedupe(fn, dedupe.shallow))

    const updateState = () => this._state(this._getState())
    this._fields.forEach(f => f.notify(updateState))
  }
  _getState () {
    const { dirty, error, validated } = this
    return { dirty, error, validated }
  }
  get _fields () { return Object.values(this.$) }
  get dirty () { return this._fields.some(f => f.dirty) }
  get validated () { return this._fields.every(f => f.validated) }
  get error () { return this._fields.map(f => f.error).find(Boolean) }
  get hasError () { return !!this.error }

  validate () { return Promise.all(this._fields.map(f => f.validate())) }

  set (values) {
    Object.entries(this.$).forEach(([k, f]) => { f.$ = values[k] })
  }

  getValues () {
    return Object.entries(this.$).reduce(
      (o, [k, f]) => { o[k] = f.$; return o },
      {}
    )
  }

  getChanges () {
    return Object.entries(this.$).reduce(
      (o, [k, f]) => { if (f.dirty) o[k] = f.$; return o },
      {}
    )
  }
}

function parse (textValue, parser) {
  return typeof parser === 'function' ? parser(textValue) : textValue
}

function format (value, formatter) {
  return typeof formatter === 'function' ? formatter(value) : String(value)
}

export
const validators = {
  required: val => !val.trim() && 'Value required',
  email: val => !/.+@.+\..+/i.test(val) && 'Enter a valid email address',
  date: val => !dayjs(val).isValid() && 'Enter a valid date',
  currency: val => !/^£?(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d{0,2})?$/.test(val) &&
    'Enter a valid amount'
}

export
const formatters = {
  date: v => dayjs(v).format('YYYY-MM-DD'),
  currency: v => v.toLocaleString(undefined,
    { style: 'currency', currency: 'GBP' }),
  boolean: v => String(v)
}

export
const parsers = {
  date: txt => dayjs(txt).startOf('day').toDate(),
  currency: txt => parseFloat(txt.toString().replace(/[£,]/g, '')),
  boolean: txt => ({ '': '', 'true': true, 'false': false }[txt])
}
