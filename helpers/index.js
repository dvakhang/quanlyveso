const fs = require('fs')
const moment = require('moment')
const chalk = require('chalk')
const _ = require('lodash')
const path = require('path')
const xlsx = require('node-xlsx').default
const { FORMAT_DATE, FORMAT_DOMAIN } = require('../constants')
const DATE_FORMAT = 'HH:mm:ss DD-MM-YYYY'
const EXPORT_DIR = path.resolve(process.env.FIBO_HOME, 'export')

/**
 * parse string to domain object{domain,domainWord,date,suffixes}
 * 
 * @param {*} str 
 * @param {*} opts {delimiter, format}
 */
const parseDomain = (str, opts) => {
  str = str || ''
  str = str.replace(/\s+/g, ' ').replace(/\t+/g, ' ').replace(/\r+/g, '').replace(/\s+$/, '')
  const format = opts.format
  const delimiter = opts.delimiter || ','
  const segments = format.split(delimiter)
  const domainIdx = segments.indexOf(FORMAT_DOMAIN)
  const dateIdx = segments.indexOf(FORMAT_DATE)
  let domain = ''
  let date = ''
  let suffixes = []

  strSegments = str.split(delimiter)
  let strSLen = strSegments.length
  if (domainIdx != -1 && strSLen >= domainIdx) {
    domain = strSegments[domainIdx].toLowerCase()
  }
  if (dateIdx != -1 && strSLen >= dateIdx) {
    date = strSegments[dateIdx]
  }
  if (!!date && date.indexOf(' ') !== -1) {
    date = date.split(' ')[0]
  }
  if (!!date) {
    date = date.toLowerCase()
  }

  const domainWord = domain.split('.')[0]
  suffixes = [domain.replace(domainWord, '')]

  return {
    domain,
    domainWord,
    date,
    suffixes,
  }
}

const showLogs = (type, ...args) => {
  if (!args || args.length === 0)
    return;

  switch (type) {
    case 'error':
      console.log(chalk.red('✗'), ...args)
      break
    case 'success':
      console.log(chalk.green('✓'), ...args)
      break
    default:
      console.log(args)
      break
  }
}

/**
 * 
 * @param msg {string} the message wants to show
 * @param type {int} [0: yellow, 1: green, 2: red, 3: blue]
 */
const log = (msg, type) => {
  type = type || 0
  const _msg = `[${moment().format(DATE_FORMAT)}]\n > ${msg}\n`
  const cmds = [
    chalk.yellow(_msg),
    `${chalk.green('✓')} ${chalk.green(_msg)}`,
    `${chalk.red('✗')} ${chalk.red(_msg)}`,
    chalk.blue(_msg)
  ]
  console.log(cmds[type])
}

const mkdirSync = (path) => {
  try {
    fs.mkdirSync(path)
  } catch (e) {
    if (e.code != 'EEXIST') throw e
  }
}

/**
 * 
 * @param {*} headers [{field: 'name', title: 'Name'}]
 * @param {*} rows [{name: 'Your Name'}]
 */
const writeExcel = async (headers, rows, filename) => {
  console.log(`export dir: ${EXPORT_DIR}`)
  const today = moment().format('DD-MM-YYYY')
  mkdirSync(EXPORT_DIR)
  mkdirSync(path.resolve(EXPORT_DIR, today))

  const fields = headers.map(h => {
    return h.field
  })
  const titles = headers.map(h => {
    return h.title
  })

  const data = [titles]
  _.forEach(rows, r => {
    let row = newArray(titles.length)
    Object.keys(r).forEach(k => {
      let v = r[k]
      let idx = fields.indexOf(k)
      if (idx !== -1) {
        row[idx] = v
      }
    })
    data.push(row)
  })
  const exportName = `${today}-${filename.split('.')[0]}`

  return new Promise((resolve, reject) => {
    const buffer = xlsx.build([{ name: 'sheet1', data: data }])
    fs.writeFile(`${EXPORT_DIR}/${today}/${today}-${filename}`, buffer, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  }).then((data) => {
    return {
      filename: `${today}-${filename}`,
      data: data,
      parent: today,
    }
  })
}

const newArray = (len) => {
  const res = []
  for (let i = 0; i < len; i++) {
    res.push('')
  }
  return res
}

module.exports = {
  parseDomain,
  showLogs,
  mkdirSync,
  log,
  writeExcel,
}
