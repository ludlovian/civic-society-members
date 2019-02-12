'use strict'

import h from '../lib/hyperscript'

import Typography from './Material/Typography'

import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import stylish from '../lib/stylish'
import sortBy from '../lib/sortBy'

dayjs.extend(advancedFormat)

export default function MemberFiles () {
  const style = `
    :self { padding: 24px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; border-bottom: solid 2px; }
    td { padding-top: 10px }
    tbody > tr:first-child > td { padding-top: 20px; }
  `

  return {
    render (vm, { member }) {
      const files = member.files.slice().sort(sortBy(f => f.date))
      const cl = stylish(style)

      return (
        <div class={cl}>
          <table>
            <TableHead />
            <tbody>
              {files.length ? <FilesList files={files} /> : <NoFiles />}
            </tbody>
          </table>
        </div>
      )
    }
  }
}
const NoFiles = {
  template: () => (
    <tr>
      <td colspan='2'>
        <Typography body1>No files recorded for this member</Typography>
      </td>
    </tr>
  )
}

const FilesList = {
  template: ({ files }) =>
    files.map(f => (
      <tr>
        <td>
          <Typography body1>{dayjs(f.date).format('Do MMM YY')}</Typography>
        </td>

        <td>
          <a href={f.link}>
            <Typography body1>{f.type}</Typography>
          </a>
        </td>
      </tr>
    ))
}

const TableHead = {
  template: () => (
    <thead>
      <tr>
        {'Date,File'.split(',').map(t => (
          <th>
            <Typography headline6>{t}</Typography>
          </th>
        ))}
      </tr>
    </thead>
  )
}
