const express = require('express')
const router = express.Router()
const moment = require('moment')
const multer = require('multer')
const mime = require('mime')
const { check } = require('express-validator/check')

const { SIGN_IN, SIGN_OUT, FORGOT, RESET } = require('../constants').URLS
const { mkdirSync } = require('../helpers')
const passportConfig = require('../config/passport')
const RequireAuthenticated = passportConfig.isAuthenticated
const IsSaler = passportConfig.isSaler
const homeController = require('../controllers/HomeController')
const authController = require('../controllers/AuthController')
const userController = require('../controllers/UserController')
const pageInfoController = require('../controllers/PageInfoController')
const agentController = require('../controllers/AgentController')

router.get(SIGN_IN, authController.getSignIn)
router.post(SIGN_IN, authController.postSignIn)
router.get(SIGN_OUT, authController.signOut)

// APIs
router.get('/api/me', userController.me)

router.route('/api/users')
  .post(userController.getUsers)

router.route('/api/users-add')
  .post(userController.addUsers)

// router.get('/api/getUserInfo', dashboardController.getUserInfo)
router.post('/api/deleteUser', userController.deleteUser)

router.post('/api/getLoginUser', pageInfoController.getUser)
router.route('/api/updateUser')
  .post(pageInfoController.updateUser)
router.route('/api/updatePassword')
  .post(pageInfoController.updatePassword)

router.get('/', homeController.getIndex)
router.get('/users', userController.getUsersView)

router.get('/agent', agentController.getIndex)
router.route('/api/agents1')
  .post(agentController.getAgents)
router.route('/api/agents2')
  .post(agentController.getAgents2)

router.route('/api/saveAgent')
  .post(agentController.saveAgent)

module.exports = router
