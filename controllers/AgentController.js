const AgentService = require('../services/AgentService')
const { matchedData } = require('express-validator/filter')

/**
 * Api get all screens
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getIndex = async (req, res) => {
  const model = {
    title: "Quản lý đại lý"
  }

  res.render('agent/index')
}

const getAgents = async (req, res, next) => {
  try {
    const data = []
    const agents = await AgentService.getAgents().then((d) => {
      return d.map(u => {
        u.website = u.website || ""
        return u
      })
    })

    res.status(200).json(agents)
  } catch (error) {
    next(error)
  }
}

const getAgents2 = async (req, res, next) => {
  try {
    const parrent = req.body.parrent
    const agents = await AgentService.getAgents2(parrent).then((d) => {
      return d.map(u => {
        u.website = u.website || ""
        return u
      })
    })

    res.status(200).json(agents)
  } catch (error) {
    next(error)
  }
}

const saveAgent = async (req, res) => {
  // const a = matchedData(req)
  const a = req.body
  //check exist agent code
  let agentMatch;
  if (a.newAgent) {
    agentMatch = await AgentService.findOneAgent(a);
  } else {
    agentMatch = false
  }
  if (!agentMatch) {
    try {
      const agent = await AgentService.saveAgent(a)
      res.status(200).json(agent)
    } catch (error) {
      res.status(500).json({ message: `Could not save agent: ${error.message}` })
    }
  } else {
    return res.status(500).json({ message: 'This agent code was created' })
  }
}

const deleteAgent = async (req, res) => {
  const { code } = matchedData(req)
  try {
    const d = await AgentService.deleteAgent(code)
    res.status(200).json(d)
  } catch (error) {
    res.status(500).json({ message: `Could not delete agent: ${error.message}` })
  }
}

module.exports = {
  getIndex,
  getAgents,
  getAgents2,
  saveAgent,
  deleteAgent
}
