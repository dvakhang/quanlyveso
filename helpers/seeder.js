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
const Agent = require('../models/Agent')

const {
  log
} = require('../helpers');

const createUsers = (roles) => {
  return User.count().then(count => {
    if (count > 0) {
      return;
    }

    const admin = new User({
      email: 'khang.dong@dounets.com',
      username: 'admin',
      password: '1',
      profile: {
        name: 'Administrator',
        gender: 'Male',
        phone: '+84979587892',
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

const createAgents = () => {
  return Agent.count().then(count => {
    if (count > 0) {
      return;
    }

    let agents = [{
      code: 'TRANTP',
      website: '',
      email: '',
      remark: '',
      name: 'Lý Uyển Trân',
      address: 'Bến Tre',
      phone: '',
      parrent: '0',
      activated: 'true'
    },
    {
      code: 'TRUNGTP',
      website: '',
      email: '',
      remark: '',
      name: 'Nguyễn Chí Trung',
      address: 'Bến Tre',
      phone: '',
      parrent: '0',
      activated: 'true'
    }];
    return Promise.all(agents.map(c => Agent.create(c)))
  });
};

const seedData = async() => {
  log(`Seeding data...`, 3)
  return Promise.all([
    createUsers(),
    createAgents()
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
