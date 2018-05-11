const mongoose = require('mongoose')
const _ = require('lodash')
const ObjectId = mongoose.Types.ObjectId

const Agent = require('../models/Agent')

const getAgents = () => {
  return Agent.find({})
}

module.exports = {
    getAgents
}