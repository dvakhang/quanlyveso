
const _ = require("lodash")
const Config = require('../models/Config')
const { SETTING } = require('../constants')
const {BLOCK_DEFINE} = SETTING

const metSaveSetting = ({ name, value }) => {
    if (_.isArray(value)) {
      value = value.join(",")
    }
    return Config.findOneAndUpdate({ name: name }, { $set: { name, value } }, { upsert: true }).then(c => {
      return {
        name: name,
        value: value,
      }
    })
  }

  const getSetting = () => {
    return Config.find({ name: { $in: [BLOCK_DEFINE] } })
  }

  module.exports = {
    metSaveSetting, getSetting
}