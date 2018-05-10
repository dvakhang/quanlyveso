const { Screen } = require('../models')

/**
 * Get All screens which activated
 */
const getScreens = () => {
  return Screen.screens()
}

module.exports = {
  getScreens,
}
