/**
 * Created by tai on 8/29/17.
 */

const User = require('../models/User')

const updateUser = async(user) => {
  console.log(`userlist: ` + user);
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

module.exports = {
  updateUser
}
