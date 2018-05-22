const AgentService = require('../services/AgentService')
const { matchedData } = require('express-validator/filter')

/**
 * Api get all screens
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getIndex = async (req, res) => {
  if (req.user) {
    const model = {
      title: "Đại lý"
    }
    res.render('agent/index')
  } else {
      res.redirect('/signin')
  }
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
    const id = req.body.id
    const agents = await AgentService.getAgents2(id).then((d) => {
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

const getAgents2Combo = async (req, res, next) => {
  try {
    const data = []
    const agents = await AgentService.getAgents2Combo().then((d) => {
      return d
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
  const { id } = matchedData(req)
  try {
    const d = await AgentService.deleteAgent(id)
    res.status(200).json(d)
  } catch (error) {
    res.status(500).json({ message: `Could not delete agent: ${error.message}` })
  }
}

module.exports = {
  getIndex,
  getAgents,
  getAgents2,
  getAgents2Combo,
  saveAgent,
  deleteAgent
}