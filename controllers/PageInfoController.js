const moment = require('moment')
const util = require('util')

const passport = require('passport');
/**
 * render index page for action /
 *
 * @param {*} req
 * @param {*} res
 */
const PageInfoService = require('../services/PageInfoService')
const User = require('../models/User');

const getPageInfoView = (req, res) => {
  const model = {}
  res.render('users/pageinfo', model)
}

const getUser = async (req, res, next) => {
  try {
    console.log("Start get user")
    //const configs = await SettingService.getSMTPConfigs()
    const data = req.user;
    console.log(`user info :`, req.user)
    res.status(200).json(data)
  } catch (error) {
    console.log(`error: `, err)
    res.status(500).json({
      message: err.message,
    })
  }
}

const updateUser = async (req, res, next) => {
  const user = req.body.data
  console.log(`req.body aaaaa: `, req.body.data)
  try {
    const updateUser = await PageInfoService.updateUser(user)
    res.status(200).json(updateUser)
  } catch (error) {
    console.log(`ERRRORRR: `, error)
    res.status(500).json({ code: error.codeName })
  }
}

const updatePassword = async (req, res) => {
  const oldPass = req.body.data.oldPass
  const newPass = req.body.data.newPass
  User.findOne({
    $or: [
      { "username": req.body.data.username },
      { "email": req.body.data.email }
    ]
  }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { msg: `Email ${email} not found.` });
    }

    user.comparePassword(oldPass, (err, isMatch) => {
      if (isMatch) {
        user.password = newPass
        try {
          const savedUser = PageInfoService.updateUser(user)
          res.status(200).json(savedUser)
        } catch (error) {
          console.log(`ERRRORRR: `, error)
          res.status(500).json({ code: error.codeName })
        }
      } else {
        return res.status(500).json({ code: 'inNotMatch', validation: 'Password does not match' })
      }
    });
  });
}

module.exports = {
  getPageInfoView,
  getUser,
  updateUser,
  updatePassword
};
