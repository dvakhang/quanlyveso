const mongoose = require('mongoose')
const chalk = require('chalk')
const moment = require('moment')
const _ = require('lodash')
/**
 * render index page for action /
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getIndex = (req, res) => {
  const model = {}
  console.log('user ', req.user)
  if (req.user) {
    if (req.session.returnTo !==undefined && req.session.returnTo !== '/') {
      return res.redirect(req.session.returnTo)
    } else {
      return res.redirect('/agent')
    }
  } else {
    return res.redirect('/signin')
  }
}

module.exports = {
  getIndex
};