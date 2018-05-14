const AgentService = require('../services/AgentService')

/**
 * Api get all screens
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getIndex = async(req, res) => {
  const model = {
    title: "Quản lý đại lý"
  }

  res.render('agent/index')
}

const getAgents = async(req, res, next) => {
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

const getAgents2 = async(req, res, next) => {
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

module.exports = {
  getIndex,
  getAgents,
  getAgents2
}
