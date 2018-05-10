/**
 * Created by tin on 8/26/17.
 */
const _ = require("lodash")

const UserService = require('../services/UserService')
const User = require('../models/User')

const getUsersView = (req, res) => {
  console.log('getUsersView')
  const model = {
    title: "User List"
  }

  res.render('users/index')
}

const getMoveDomainsUserView = async(req, res) => {
  const userId = req.params.id
  const user = await UserService.findUserById(userId)
  if (!user) {
    return res.redirect('/users')
  }

  res.render('users/moveDomains', {
    curUser: user
  })
}


const toInt = (str) => {
  try {
    return parseInt(str)
  } catch (_) {
    return undefined
  }
}

/**
 * Api get all users for datatables
 */
const getUsers = async(req, res, next) => {
  const data = req.body
  const pageSize = toInt(req.query.length) || 10
  const pageFrom = toInt(req.query.start) || 0
  const draw = toInt(req.query.draw) || 0
  const q = data.search.value || ''

  try {
    const data = []
    const users = await UserService.getUsers().then((users) => {
      return users.map(u => {
        u.profile.location = u.profile.location || ""
        u.profile.website = u.profile.website || ""
        return u
      })
    })

    res.status(200).json(users)
  } catch (error) {
    next(error)
  }

}
/**
 * Insert New User
 * @param req
 * @param res
 * @param next
 */
const addUsers = async(req, res) => {
  req.assert('username', 'Username cannot be blank').notEmpty();
  //req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  if (!!req.body.email) {
    req.sanitize('email').normalizeEmail({ remove_dots: false })
  }

  const result = await req.getValidationResult()

  if (!result.isEmpty()) {
    const errors = result.array()
    return res.status(500).json({ code: `validation`, validation: errors })
  }

  const user = req.body
  try {
    const savedUser = await UserService.addOrSaveUser(user)
    res.status(200).json(savedUser)
  } catch (error) {
    console.log(`ERRRORRR: `, error)
    res.status(500).json({ code: error.codeName })
  }
}

/**
 * Delete User
 * @param {*} req 
 * @param {*} res 
 */
const deleteUser = async(req, res) => {
  try {
    const { saler } = req.body
    const result = await UserService.deleteUser(saler)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ message: `Could not save customer: ${error.message}` })
  }
}

const me = (req, res) => {
  res.status(200).json(req.user)
}

module.exports = {
  getUsersView,
  getUsers,
  addUsers,
  deleteUser,
  me,
}
