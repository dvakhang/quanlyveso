/**
 * Copyright © 2017 LTV Co., Ltd. All Rights Reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by luc <luc@ltv.vn> on Aug 24, 2017
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const namedScopesPlugin = require('mongoose-named-scopes')
const relationship = require('mongoose-relationship')

const screenSchema = new mongoose.Schema({
  name: String,
  route: String,
  view: String,
  title: String,
  icon: {
    type: String,
    default: 'dashboard',
  },
  type: {
    type: String,
    default: 'backend',
  },
  description: String,
  activated: {
    type: Boolean,
    default: true,
  },
  role: { type: Schema.ObjectId, ref: 'Role', childPath: 'screens' },
  order: {
    type: Number,
    default: 1,
  },
  parent: String,
}, {
  timestamps: true
})

/**
 * Plugins
 */
screenSchema.plugin(namedScopesPlugin)
screenSchema.plugin(relationship, { relationshipPathName: 'role' })

screenSchema.scope('screens').where('activated').equals(true)

const Screen = mongoose.model('Screen', screenSchema)

module.exports = Screen
