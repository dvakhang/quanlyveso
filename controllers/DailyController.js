// const ScreenService = require('../services/ScreenService')

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

  res.render('quanlydaily/index')
}

module.exports = {
  getIndex,
}
