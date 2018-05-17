
const mongoose = require('mongoose')
const _ = require('lodash')
const ObjectId = mongoose.Types.ObjectId
const Distribute = require('../models/Distribute')

const getDistribute = (type) => {
    return Distribute.find({
        type: type
    }).populate('agent')
}

const saveDistribute = (distribute) => {
    distribute._id = distribute._id || new ObjectId()
    return Distribute.findOneAndUpdate({ _id: distribute._id }, { $set: distribute }, { upsert: true })
        .then(() => {
            return distribute
        })
}

module.exports = {
    getDistribute,
    saveDistribute
}