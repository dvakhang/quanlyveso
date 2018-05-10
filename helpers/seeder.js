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
const Screen = require('../models/Screen')

const {
  log
} = require('../helpers');


const createScreens = () => {
  return Screen.count().then(count => {
    if (count > 0) {
      return;
    }
    const screens = [{
      name: 'download',
      route: '/download',
      title: 'Download History',
      icon: 'file_download',
      view: 'home/download',
      order: 2,
    }, {
      name: 'dbvn',
      route: '/dbvn',
      title: 'DBVN',
      icon: 'dns',
      view: 'dbview/dbvn',
      order: 3,
    }, {
      name: 'dbresult',
      route: '/dbresult',
      title: 'DB Result',
      icon: 'domain',
      view: 'dbview/dbresult',
      order: 4,
    }, {
      name: 'users',
      route: '/users',
      title: 'User List',
      icon: 'supervisor_account',
      view: 'users/index',
      order: 5,
    }]

    const promises = []
    screens.forEach(s => {
      promises.push(Screen.create(s))
    })

    return Promise.all(promises)
  })
}

const createRoles = (screens) => {
  return Role.count().then(count => {
    if (count > 0) {
      return;
    }

    const roles = [{
      name: 'Admin',
      code: 'ADMIN',
      description: 'Administrator, Can access all screens',
      screens,
    }, {
      name: 'Manager',
      code: 'MANAGER',
      description: '',
      screens,
    }, {
      name: 'Sales',
      code: 'SALE',
      description: '',
      screens,
    }, {
      name: 'IT',
      code: 'IT',
      description: '',
      screens,
    }, {
      name: 'User',
      code: 'USER',
      description: 'Normal User',
      screens: [],
    }];

    const promises = []
    roles.forEach(r => {
      promises.push(Role.create(r))
    })

    return Promise.all(promises)
  })
}

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
    createScreens().then(screens => {
      if (screens) {
        log(`Created ${screens.length} screens`, 1)
        return createRoles(screens)
      } else {
        return
      }
    }),
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
