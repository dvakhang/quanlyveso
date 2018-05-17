/**
 * Written by khang <dvakhang34@gmail.com> on May 11, 2018
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const relationship = require("mongoose-relationship");

const agentSchema = new mongoose.Schema({
  code: String,
  website: String,
  email: String,
  remark: String,
  name: String,
  phone: String,
  parrent: { type: Schema.ObjectId, ref: 'Agent', childPath: 'agents' },
  address: String,
  agent: [{ type: Schema.ObjectId, ref: 'Agent', childPath: 'agents' }],
  represent: String,
  activated: {
    type: String,
    default: true,
  }
}, {
  timestamps: true
});

const Agent = mongoose.model('Agent', agentSchema);

module.exports = Agent;
