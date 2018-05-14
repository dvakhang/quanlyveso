const mongoose = require('mongoose')
const _ = require('lodash')
const ObjectId = mongoose.Types.ObjectId

const Agent = require('../models/Agent')

const getAgents = () => {
  return Agent.findAndCountAll({
    attributes: Object.keys(Agent.attributes).concat([
      [sequelize.literal('(SELECT Count(*) FROM "Agent" WHERE "Agent"."code" = "parrent")'), 'totalAmount']
    ]),
    parrent: '0'
  })
}

const getAgents2 = (parrent) => {

  return Agent.find({
    parrent: parrent
  })
}

module.exports = {
  getAgents,
  getAgents2
}