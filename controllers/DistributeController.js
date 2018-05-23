const DistributeService = require('../services/DistributeService')
const { matchedData } = require('express-validator/filter')

const getIndex = (req, res) => {
  if (req.user) {
    const model = {
      title: "Phân phối / Trả vé"
    }
    res.render('distribute/index', model)
  } else {
    res.redirect('/signin')
  }

}

const getDistribute = async (req, res) => {
  const type = req.body.type
  const distributes = await DistributeService.getDistribute(type).then((d) => {
    return d
  })
  res.status(200).json(distributes)
}

const saveDistribute = async (req, res) => {
  if (!req.body.distribute.agent) {
    return res.status(500).json({ code: `validation`, validation: 'Agent cannot be blank' })
  }
  if (req.body.distribute.agent === '') {
    return res.status(500).json({ code: `validation`, validation: 'Agent cannot be blank' })
  }
  const distribute = req.body.distribute
  const rTurn = await DistributeService.saveDistribute(distribute).then((d) => {
    res.status(200).json(d)
  })
}

const deleteDistribute = async (req, res) => {
  const { id } = matchedData(req)
  try {
    const d = await DistributeService.deleteDistribute(id)
    res.status(200).json(d)
  } catch (error) {
    res.status(500).json({ message: `Could not delete distribute: ${error.message}` })
  }
}

module.exports = {
  getIndex,
  getDistribute,
  saveDistribute,
  deleteDistribute
}