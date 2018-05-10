/**
 * Copyright © 2016 LTV Co., Ltd. All Rights Reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by luc <luc@ltv.vn> on Jan 24, 2017
 */

const _ = require('lodash')
const faker = require('faker')
const moment = require('moment')

const User = require('../models/User')

const {
  log
} = require('../helpers');

const createUsers = (roles) => {
  return User.count().then(count => {
    if (count > 0) {
      return;
    }

    const admin = new User({
      email: 'admin@fibo.vn',
      username: 'admin',
      password: '123789',
      profile: {
        name: 'Administrator',
        gender: 'Male',
        phone: '+84901861929',
      },
      deleteFlag: false,
      activeFlag: true,
      admin: true,
      publish: true,
      role:'ADMIN'
    });
    return User.create([admin])
  });
};

const seedData = async() => {
  log(`Seeding data...`, 3)
  return Promise.all([
    createUsers(),
  ]).then(async(data) => {
    const users = data[0]
    
    if (users) {
      log(`Created ${users.length} users`, 1)
    }
    return true
  }).then(() => {
    log(`Seeding Done`, 1)
    return true
  })
}

module.exports = {
  seedData,
};
