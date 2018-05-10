const ScreenService = require('../services/ScreenService')

/**
 * Api get all screens
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getScreens = async(req, res) => {
  try {
    const screens = await ScreenService.getScreens()
    res.status(200).json(screens)
  } catch (error) {
    res.status(500).json(`Could not get screens ${error.message}`)
  }
}

module.exports = {
  getScreens,
}
