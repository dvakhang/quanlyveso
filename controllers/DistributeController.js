const DistributeService = require('../services/DistributeService')

const getIndex = (req, res) => {
    const model = {
        title: "Phân phối / Trả vé"
    }
    res.render('distribute/index', model)
}

const getDistribute = async(req, res) => {
    const type = req.body.type
    const distributes = await DistributeService.getDistribute(type).then((d)=>{
        return d
    })
    res.status(200).json(distributes)
}

const saveDistribute = async(req, res) => {
    const distribute = req.body.distribute
    const rTurn = await DistributeService.saveDistribute(distribute).then((d)=>{
        res.status(200).json(d)
    })
}

module.exports = {
    getIndex, getDistribute, saveDistribute
}