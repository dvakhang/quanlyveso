/**
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Khang.Dong <dvakhang34@gmail.com> on May 01, 2018
 */

const _ = require('lodash')
const faker = require('faker')
const moment = require('moment')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const User = require('../models/User')
const Agent = require('../models/Agent')
const Config = require('../models/Config')

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

const createConfigs = () => {
  return Config.count().then(count => {
    if (count > 0)
      return;

    let configs = [{
      name: 'BLOCK_DEFINE',
      value: 1000,
    }];

    let promises = [];
    _.forEach(configs, (c) => {
      promises.push(Config.create(c));
    });

    return Promise.all(promises);
  })
}

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
      parrent: ObjectId('000000000000000000000000'),
      activated: 'true',
      represent: 'Lý Uyển Trân',
      createdDt: '2018-05-01 19:12'
    },
    {
      code: 'TRUNGTP',
      website: '',
      email: '',
      remark: '',
      name: 'Nguyễn Chí Trung',
      address: 'Bến Tre',
      phone: '',
      parrent: ObjectId('000000000000000000000000'),
      activated: 'true',
      represent: 'Nguyễn Chí Trung',
      createdDt: '2018-05-01 19:12'
    }];
    return Promise.all(agents.map(c => Agent.create(c)))
  });
};

const seedData = async() => {
  log(`Seeding data...`, 3)
  return Promise.all([
    createUsers(),
    createAgents(),
    createConfigs()
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
