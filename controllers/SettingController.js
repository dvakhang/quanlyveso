const SettingService = require('../services/SettingService')

const getIndex = async (req, res) => {
  if (req.user) {
    const model = {
      title: "Setting"
  }
  res.render('setting/index')
  } else {
      res.redirect('/signin')
  }
}

const metSaveSetting = async(req, res) => {
    try {
      console.log('Server Handling...')
      const data = req.body.data;
      const configs = await Promise.all(Object.keys(data).map(k => {
        return SettingService.metSaveSetting({
          name: k,
          value: data[k]
        })
      }))
      res.status(200).json(configs)
    } catch (err) {
      console.log(`error: `, err)
      res.status(500).json({
        message: err.message,
      })
    }
  }

const getSetting = async(req, res) => {
    try {
      const configs = await SettingService.getSetting()
      const smtpConfig = {}
      configs.forEach(c => {
        smtpConfig[c.name] = c.value
      })
      res.status(200).json(smtpConfig)
    } catch (error) {
      console.log(`error: `, err)
      res.status(500).json({
        message: err.message,
      })
    }
  }
module.exports = {
    getIndex, 
    metSaveSetting, 
    getSetting
}