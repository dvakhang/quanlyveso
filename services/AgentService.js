const mongoose = require('mongoose')
const _ = require('lodash')
const ObjectId = mongoose.Types.ObjectId

const Agent = require('../models/Agent')

const getAgents = () => {
  return Agent.find({
    parrent: '0'
  })
}

const getAgents2 = (id) => {

  return Agent.find({
    parrent: id
  })
}

const findOneAgent = async (a) => {
  let d = await Agent.findOne({ code: a.code })
  return d;
}

const saveAgent = (agent) => {
  agent._id = agent._id || new ObjectId()
  return Agent.findOneAndUpdate({ _id: agent._id }, { $set: agent }, { upsert: true })
    .then(() => {
      return agent
    })
}

const deleteAgent = async (id) => {
  console.log(id)
  await Agent.deleteMany({ parrent: id})
  return await Agent.findOneAndRemove({ _id: ObjectId(id) })
}

module.exports = {
  getAgents,
  getAgents2,
  findOneAgent,
  saveAgent,
  deleteAgent
}