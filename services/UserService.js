/**
 * Created by tin on 8/26/17.
 */

const mongoose = require('mongoose')
const _ = require('lodash')
const ObjectId = mongoose.Types.ObjectId

const User = require('../models/User')

const getUsers = () => {
  return User.find({})
}

/**
 * Get Users By Roles
 * 
 * @param {*} roles 
 */
const getUsersByRoles = (roles) => {
  if (!roles || roles.length === 0) {
    return Promise.resolve([])
  }
  return User.find({ activeFlag: true, role: { $in: roles } })
}

const countUser = () => {
  return User.count()
}

const findUserById = (userId, populate = false) => {
  return !populate ? User.findById(userId) : User.findById(userId).populate("domains")
}

const getUsersForDatatables = () => {
  return Promise.all([getUsers(), countUser()]).then((data) => {
    return {
      total: data[1],
      users: data[0]
    }
  })
}

const addOrSaveUser = (user) => {
  let username = user.username;
  let password = user.password;
  if (user._id) {
    // delete user.username
  } else {
    delete user._id
  }

  if (username === 'admin') {
    delete user.role
  }
  if(!password){
    delete user.password
  }
  return findOneAndUpdate(user)
}

const findOneAndUpdate = async(user) => {
  let _user = await User.findOne({ username: user.username })
  if (_user) {
    Object.keys(user).forEach((k) => {
      _user[k] = user[k]
    })
    return _user.save()
  } else {
    return User.create(user)
  }
}

/**
 *
 * @param {*} db
 * @param {*} page {from: init, size: init}
 */
const fetchAllUsersWithLimit = async(db, opts) => {
  const c = db.collection('users')
  const { total, filtered } = await Promise.all([c.count(), c.find({
    $or: [
      { email: { $regex: `.*${opts.query || ''}.*` } },
      { username: { $regex: `.*${opts.query || ''}.*` } },
      { name: { $regex: `.*${opts.query || ''}.*` } },
      { role: { $regex: `.*${opts.query || ''}.*` } },
      { gender: { $regex: `.*${opts.query || ''}.*` } },
      { phone: { $regex: `.*${opts.query || ''}.*` } },
      { location: { $regex: `.*${opts.query || ''}.*` } },
      { website: { $regex: `.*${opts.query || ''}.*` } },
    ]
  }).count()]).then(data => {
    return {
      total: data[0],
      filtered: data[1],
    }
  })

  opts = opts || { from: 0, size: total }
  opts.from = opts.from || 0
  opts.size = opts.size || total

  return findUserstWithLimit(c, {
      skip: opts.from === 0 ? 0 : opts.from - 1,
      limit: opts.size,
      query: opts.query,
    })
    .then((users) => {
      return users.map((u) => {
        return {
          _id: u._id,
          email: u.email,
          username: u.username,
          name: u.profile.name,
          role: u.role,
          gender: u.profile.gender,
          phone: u.profile.phone,
          location: u.profile.location,
          website: u.profile.website,
        }
      })
    })
    .then((users) => {
      return {
        total,
        filtered,
        users,
      }
    })
}

const findUserstWithLimit = (collection, opts) => {
  opts = opts || { skip: 0, limit: 10 }
  let Users = []
  let searchOpts = {}
  if (opts.query) {
    searchOpts.$or = [
      { email: { $regex: `.*${opts.query || ''}.*` } },
      { username: { $regex: `.*${opts.query || ''}.*` } },
    ]
  }

  return new Promise((resolve, reject) => {
    collection.find(searchOpts)
      .skip(opts.skip)
      .limit(opts.limit)
      .sort({ createdAt: 1 })
      .toArray((err, domains) => {
        if (!err) {
          resolve(domains)
        } else {
          reject(err)
        }
      })
  })
}

const deleteUser = (userId) => {
  return User.remove({ _id: new ObjectId(userId) })
}

/**
 * Get Admin And Manger
 * 
 */
const getAdminAndManager = () => {
  return User.find({ role: { $in: ["ADMIN", "MANAGER"] }, activeFlag: true })
}

module.exports = {
  getUsers,
  countUser,
  getUsersForDatatables,
  addOrSaveUser,
  fetchAllUsersWithLimit,
  deleteUser,
  findUserById,
  getAdminAndManager,
  getUsersByRoles,
}
