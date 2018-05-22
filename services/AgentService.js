const mongoose = require('mongoose')
const _ = require('lodash')
const ObjectId = mongoose.Types.ObjectId

const Agent = require('../models/Agent')
const Distribute = require('../models/Distribute')
const moment = require('moment')

const getAgents = () => {
  return Agent.find({
    parrent: ObjectId('000000000000000000000000')
  })
}

const getAgents2Combo = () => {
  return Agent.find({
    parrent: { $ne: ObjectId('000000000000000000000000') }
  }).select('_id name')
}

const getAgents2 = (id) => {

  return Agent.find({
    parrent: id
  }).populate('parrent')
}

const findOneAgent = async (a) => {
  let d = await Agent.findOne({ code: a.code })
  return d;
}

const saveAgent = async (agent) => {
  if(!agent._id){
    const today = moment().format('YYYY-MM-DD HH:mm:ss')
    agent.createdDt = today
  }
  agent._id = agent._id || new ObjectId()
  if (agent.parrent === '0') {
    agent.parrent = ObjectId('000000000000000000000000')
  } else {
    await Agent.findOneAndUpdate({ _id: ObjectId(agent._id) }, { $set: { agent: agent } }, { upsert: true })
  }
  console.log('_id: ', ObjectId(agent._id))

  return Agent.findOneAndUpdate({ _id: agent._id }, { $set: agent }, { upsert: true })
    .then(() => {
      return agent
    })
}

const deleteAgent = async (id) => {
  console.log(id)
  await Agent.deleteMany({ parrent: ObjectId(id) })
  await Distribute.deleteMany({ agent: ObjectId(id) })
  return await Agent.findOneAndRemove({ _id: ObjectId(id) })
}

module.exports = {
  getAgents,
  getAgents2Combo,
  getAgents2,
  findOneAgent,
  saveAgent,
  deleteAgent
}