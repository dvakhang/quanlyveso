const mongoose = require('mongoose')
const _ = require('lodash')
const ObjectId = mongoose.Types.ObjectId
const Distribute = require('../models/Distribute')
const { BLOCK_DEFINE } = require('../constants').SETTING
const SettingService = require('./SettingService')
const moment = require('moment')

const getDistribute = (type) => {
  return Distribute.find({
    type: type
  }).populate('agent')
    .select("_id type block quantity agent createdDt")
    .sort({createdAt: -1})
}

const saveDistribute = async(distribute) => {
  if(!distribute._id){
    const today = moment().format('YYYY-MM-DD HH:mm:ss')
    distribute.createdDt = today
  }
  distribute._id = distribute._id || new ObjectId()
  if (distribute.type == 'PP') {
    const blockDefine = await SettingService.getSetting();
    distribute.quantity = parseInt(blockDefine[0].value) * parseInt(distribute.block)
  }
  return Distribute.findOneAndUpdate({ _id: distribute._id }, { $set: distribute }, { upsert: true })
    .then(() => {
      return distribute
    })
}

const deleteDistribute = async(id) => {
  return await Distribute.findOneAndRemove({ _id: ObjectId(id) })
}

module.exports = {
  getDistribute,
  saveDistribute,
  deleteDistribute
}