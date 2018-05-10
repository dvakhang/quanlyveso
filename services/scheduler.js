const schedule = require('node-schedule')
const _ = require('lodash')
const moment = require('moment')

const { log } = require('../helpers')
const { VN_TIME_FORMAT } = require('../constants')

const now = () => {
  return moment().format(VN_TIME_FORMAT)
}
const schedules = {}

const startSchedule = (name) => {
  if (schedules[name]) {
    schedules[name].cancel()
  }
  if (!tasks[name])
    return
  schedules[name] = tasks[name]()
}

module.exports = {
  startSchedule,
}
