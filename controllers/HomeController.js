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
  if(req.user){
    console.log('uerrrrrrrrrrrrrrrr')
    return res.redirect('/users')
  }else{
    console.log('singiiiiiiiiiiiiiiii')
    return res.redirect('/signin')
  }
  // switch (req.user.role) {
  //   case 'SALE':
  //     break
  //   case 'MANAGER':
  //   case 'ADMIN':
  //     return res.redirect('/users')
  //     break
  //   default:
  //     return res.render('home/index', model)
  //     break
  // }
}

module.exports = {
  getIndex
};
